/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from 'models/user.model';
import CreateUserDto from '@dtos/user.dto';
import LogInDto from '@dtos/login.dto';
import SecondAuthDto from '@dtos/secondAuth.dto';
import User from '@interfaces/user.interface';
import TokenData from '@interfaces/tokenData.interface';
import DataStoredInToken from '@interfaces/dataStoredInToken.interface';
import UserWithThatEmailAlreadyExistsException from '@exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialException from '@exceptions/WrongCredentialException';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { Response } from 'express';

class AuthenticationService {
  public user = userModel;

  public async register(userData: CreateUserDto) {
    if (await this.user.findOne({ where: { email: userData.email } })) {
      // 동일한 email을 가진 사용자가 존재하면
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    } else {
      const user = await this.user.create(userData);
      user.password = undefined;
      return user;
    }
  }

  public async loggingIn(logInData: LogInDto, res: Response) {
    const user = await this.user.findOne({ where: { email: logInData.email } });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        const { otpauthUrl, base32 } = this.getTwoFactorAuthenticationCode();
        await this.user.update(
          {
            twoFactorAuthenticationCode: base32,
          },
          { where: { id: user.id } },
        );
        return otpauthUrl;
      } else {
        throw new WrongCredentialException();
      }
    } else {
      throw new WrongCredentialException();
    }
  }

  /* 2단계 인증 */
  private getTwoFactorAuthenticationCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return {
      otpauthUrl: secretCode.otpauth_url, // QR Code 생성에 사용. Google Authenticator와 양립하는 One Time Password Authentication (OTPA).
      base32: secretCode.base32, // 사용자 신원 검증
    };
  }

  public respondWithQRCode(res: Response, data: string) {
    QRCode.toFileStream(res, data);
  }

  // 사용자가 Google OTP에서 얻은 1회용 패스워드가 DB에 저장된 secret code와 일치하는지 검증한다.
  public async verifyTwoFactorAuthenticationCode(secondAuthData: SecondAuthDto) {
    const user = await this.user.findOne({ where: { email: secondAuthData.email } });
    const isCodeValid = await speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationCode,
      encoding: 'base32',
      token: secondAuthData.twoFactorAuthenticationCode,
    });
    return {
      isCodeValid,
      user,
    };
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  public createToken(user: User, isSecondFactorAuthenticated = false): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      isSecondFactorAuthenticated,
      id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationService;

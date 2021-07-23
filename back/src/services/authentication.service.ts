/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from 'src/models/user.model';
import CreateUserDto from 'src/dtos/user.dto';
import LogInDto from 'src/dtos/login.dto';
import SecondAuthDto from 'src/dtos/secondAuth.dto';
import EmailDto from 'src/dtos/email.dto';
import User from 'src/interfaces/user.interface';
import TokenData from 'src/interfaces/tokenData.interface';
import DataStoredInToken from 'src/interfaces/dataStoredInToken.interface';
import UserWithThatEmailAlreadyExistsException from 'src/exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialException from 'src/exceptions/WrongCredentialException';
import DuplicatedNicknameException from 'src/exceptions/DuplicatedNicknameException';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';

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

  public async sendEmailForAuthenticatiion(emailData: EmailDto) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const mailOpt = {
      from: process.env.SENDER_EMAIL,
      to: emailData.receiverEmail,
      subject: '🟪 가입 인증을 진행해주세요 🟪',
      html: `👻 PICKYPLAY 서비스를 이용해 주셔서 감사합니다💜<br> 
      아래 번호를 입력하시면 가입 인증이 이루어집니다.<br>
      <b>${emailData.emailAuthCode}</b><br>
      이메일 인증이 완료되어야 정상적으로 가입 진행이 가능합니다.<br>`,
    };

    await transporter.sendMail(mailOpt, (error) => {
      if (error) {
        throw error;
      } else {
        console.log(`Email has been sent.`);
      }
    });

    transporter.close();
  }

  public async checkDuplicatedNickname(nickname: string) {
    if (await this.user.findOne({ where: { nickname } })) {
      // 동일한 email을 가진 사용자가 존재하면
      throw new DuplicatedNicknameException(nickname);
    } else {
      return '사용 가능한 닉네임입니다.';
    }
  }

  public async loggingIn(logInData: LogInDto) {
    const user = await this.user.findOne({ where: { email: logInData.email } });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        const result = !user.twoFactorAuthenticationCode ? user : 'Activate 2FA';
        return result;
      } else {
        throw new WrongCredentialException();
      }
    } else {
      throw new WrongCredentialException();
    }
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
    if (process.env.NODE_ENV === 'production') {
      return `Authorization=${tokenData.token}; HttpOnly; Secure; Path=/; Max-Age=${tokenData.expiresIn}; Domain=.pickyplay.site`;
    } else {
      return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}`;
    }
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      userIdx: user.userIdx,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationService;

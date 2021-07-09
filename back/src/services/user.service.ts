import userModel from 'src/models/user.model';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from 'src/interfaces/user.interface';
import UserWithThatEmailAlreadyExistsException from 'src/exceptions/UserWithThatEmailAlreadyExistsException';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';

class UserService {
  public user = userModel;

  /* 2단계 인증 */
  public async generateQRCodeURL(user: User) {
    const { otpauthUrl, base32 } = await this.generateSecretCode();

    await this.user.update(
      {
        twoFactorAuthenticationCode: base32,
      },
      { where: { id: user.id } },
    );

    return QRCode.toDataURL(otpauthUrl);
  }

  private generateSecretCode() {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });

    return {
      otpauthUrl: secretCode.otpauth_url, // QR Code 생성에 사용. Google Authenticator와 양립하는 One Time Password Authentication (OTPA).
      base32: secretCode.base32, // 사용자 신원 검증
    };
  }

  public async enable2FA(id: string) {
    await this.user.update(
      {
        is2FAOn: true,
      },
      { where: { id } },
    );
  }

  public async disable2FA(id: string) {
    await this.user.update(
      {
        twoFactorAuthenticationCode: null,
        is2FAOn: false,
      },
      { where: { id } },
    );
  }

  public async updateUserEmail(req: RequestWithUser) {
    const newEmail: string = req.body.email;
    const exUser = await this.user.findOne({ where: { email: newEmail } });
    if (!exUser) {
      await this.user.update(
        {
          email: newEmail,
        },
        { where: { id: req.user.id } },
      );
    } else {
      throw new UserWithThatEmailAlreadyExistsException(newEmail);
    }
  }

  public async updateUserPassword(req: RequestWithUser) {
    const newPassword: string = req.body.password;

    await this.user.update(
      {
        password: newPassword,
      },
      { where: { id: req.user.id }, individualHooks: true },
    );
  }
}

export default UserService;

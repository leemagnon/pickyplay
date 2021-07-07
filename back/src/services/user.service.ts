import userModel from 'src/models/user.model';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from 'src/interfaces/user.interface';

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

  public enable2FA(user: User) {
    this.user.update(
      {
        is2FAOn: true,
      },
      { where: { id: user.id } },
    );
  }

  public disable2FA(user: User) {
    this.user.update(
      {
        twoFactorAuthenticationCode: null,
        is2FAOn: false,
      },
      { where: { id: user.id } },
    );
  }
}

export default UserService;

interface User {
  id?: string;
  email: string;
  password: string;
  twoFactorAuthenticationCode: string;
  is2FAOn: boolean;
  nickname: string;
  profileImgUrl: string;
}

export default User;

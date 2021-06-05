interface User {
  id?: string;
  email: string;
  password: string;
  twoFactorAuthenticationCode: string;
  nickname: string;
  profileImgUrl: string;
  introWords: string;
}

export default User;

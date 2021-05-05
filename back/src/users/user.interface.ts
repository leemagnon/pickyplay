interface User {
    _id: string;
    email: string;
    password: string;
    address?: {
        street: string,
        city: string,
    };
    twoFactorAuthenticationCode: string;
    nickname: string;
    profileImgUrl: string;
    introWords: string;
    isOnline: boolean;
}

export default User;
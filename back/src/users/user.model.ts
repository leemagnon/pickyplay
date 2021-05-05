import mongoose from 'mongoose';
import User from '@users/user.interface';

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    address: String,
    twoFactorAuthenticationCode: String,
    nickname: String,
    profileImgUrl: String,
    introWords: String,
    isOnline: Boolean
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
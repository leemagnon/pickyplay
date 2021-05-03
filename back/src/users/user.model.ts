import mongoose from 'mongoose';
import User from '@users/user.interface';

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    nickname: String,
    twoFactorAuthenticationCode: String,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';
import UserWithThatEmailAlreadyExistsException from '@exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialException from '@exceptions/WrongCredentialException';
import Controller from '@interfaces/controller.interface';
import TokenData from '@interfaces/tokenData.interface';
import DataStoredInToken from '@interfaces/dataStoredInToken.interface';
import validationMiddleware from '@middleware/validation.middleware';
import CreateUserDto from '@users/user.dto';
import userModel from '@users/user.model';
import User from '@users/user.interface';
import LogInDto from '@authentication/login.dto';

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (req: Request, res: Response, next: NextFunction) => {
        const userData: CreateUserDto = req.body;
        
        if(await this.user.findOne({ email: userData.email })) { // 동일한 email을 가진 사용자가 존재하면
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({
                ...userData,
                password: hashedPassword,
            });
            user.password = undefined;
            const tokenData = this.createToken(user);
            res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            res.send(user);
        }
    }

    private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
        const logInData: LogInDto = req.body;

        const user = await this.user.findOne({ email: logInData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const tokenData = this.createToken(user);
                res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                res.send(user);
            } else {
                next(new WrongCredentialException());
            } 
        } else {
            next(new WrongCredentialException());
        }
    }

    private loggingOut = (req: Request, res: Response) => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-Age=0']);
        res.send(200);
    }

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
    }

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        }
    }
}

export default AuthenticationController;
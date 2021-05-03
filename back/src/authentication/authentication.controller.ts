import express, { Request, Response, NextFunction } from 'express';
import Controller from '@interfaces/controller.interface';
import CreateUserDto from '@users/user.dto';
import LogInDto from '@authentication/login.dto';
import AuthenticationService from '@authentication/authentication.service';
import validationMiddleware from '@middleware/validation.middleware';
import RequestWithUser from '@interfaces/requestWithUser.interface';
import userModel from '@users/user.model';
import authMiddleware from '@middleware/auth.middleware';
import WrongAuthenticationTokenException from '@exceptions/WrongAuthenticationTokenException';
import TwoFactorAuthenticationDto from './twoFactorAuthentication.dto';

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private authenticationService = new AuthenticationService();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/2fa/authenticate`, validationMiddleware(TwoFactorAuthenticationDto), this.secondFactorAuthentication);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (req: Request, res: Response, next: NextFunction) => {
        const userData: CreateUserDto = req.body;
        try {
            const {
                cookie,
                user,
            } = await this.authenticationService.register(userData);
            res.setHeader('Set-Cookie', [cookie]);
            res.send(user);
        } catch (error) {
            next(error);
        }
    }

    private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
        const logInData: LogInDto = req.body;
        try {
            const otpauthUrl = await this.authenticationService.loggingIn(logInData, res);
            this.authenticationService.respondWithQRCode(res, otpauthUrl);
        } catch (error) {
            next(error);
        }
    }

    private loggingOut = (req: Request, res: Response) => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-Age=0']);
        res.send(200);
    }

    private secondFactorAuthentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { twoFactorAuthenticationCode, email } = req.body;
        const { isCodeValid, user } = await this.authenticationService.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, email);
        if (isCodeValid) {
            const tokenData = this.authenticationService.createToken(user, true);
            user.password = undefined;
            user.twoFactorAuthenticationCode = undefined;
            res.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)]);
            res.send({
                user,
            });
        } else {
            next(new WrongAuthenticationTokenException());
        }
    }
}

export default AuthenticationController;
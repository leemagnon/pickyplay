import express, { Request, Response, NextFunction } from 'express';
import Controller from '@interfaces/controller.interface';
import CreateUserDto from '@dtos/user.dto';
import LogInDto from '@dtos/login.dto';
import SecondAuthDto from '@dtos/secondAuth.dto';
import EmailDto from '@dtos/email.dto';
import AuthenticationService from 'services/authentication.service';
import RequestWithUser from '@interfaces/requestWithUser.interface';
import authMiddleware from '@middleware/auth.middleware';
import WrongAuthenticationTokenException from '@exceptions/WrongAuthenticationTokenException';
import randomBytes from 'randombytes';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(`${this.path}/emailAuthCode`, this.getEmailAuthCode);
    this.router.post(`${this.path}/login`, this.loggingIn);
    this.router.post(`${this.path}/2fa/authenticate`, this.secondFactorAuthentication);
    this.router.post(`${this.path}/logout`, authMiddleware, this.loggingOut);
  }

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req.body : ', req.body);
    const userData: CreateUserDto = req.body;
    try {
      const user = await this.authenticationService.register(userData);
      res.send(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private getEmailAuthCode = async (req: Request, res: Response, next: NextFunction) => {
    const hexKey = randomBytes(256).toString('hex').substr(100, 5);
    const base64Key = randomBytes(256).toString('base64').substr(50, 5);
    const emailData: EmailDto = {
      receiverEmail: req.body.email,
      emailAuthCode: hexKey + base64Key,
    };

    try {
      await this.authenticationService.sendEmailForAuthenticatiion(emailData);
      res.status(200).send(emailData.emailAuthCode);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
    try {
      const otpauthUrl = await this.authenticationService.loggingIn(logInData, res);
      this.authenticationService.respondWithQRCode(res, otpauthUrl);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private secondFactorAuthentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const secondAuthData: SecondAuthDto = req.body;
    const { isCodeValid, user } = await this.authenticationService.verifyTwoFactorAuthenticationCode(secondAuthData);
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
  };

  private loggingOut = (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-Age=0']);
    res.send(200);
  };
}

export default AuthenticationController;
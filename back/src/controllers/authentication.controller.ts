import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import CreateUserDto from 'src/dtos/user.dto';
import LogInDto from 'src/dtos/login.dto';
import SecondAuthDto from 'src/dtos/secondAuth.dto';
import EmailDto from 'src/dtos/email.dto';
import AuthenticationService from 'src/services/authentication.service';
import UserService from 'src/services/user.service';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import authMiddleware from 'src/middleware/auth.middleware';
import randomBytes from 'randombytes';
import WrongOTPException from 'src/exceptions/WrongOTPException';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, authMiddleware, this.getMyInfo);
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(`${this.path}/emailAuthCode`, this.getEmailAuthCode);
    this.router.post(`${this.path}/nickname`, this.checkDuplicatedNickname);
    this.router.post(`${this.path}/login`, this.loggingIn);
    this.router.post(`${this.path}/2fa/authenticate`, this.secondFactorAuthentication);
    this.router.post(`${this.path}/logout`, authMiddleware, this.loggingOut);
  }

  private getMyInfo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.status(201).send(req.user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    try {
      const user = await this.authenticationService.register(userData);
      res.status(201).send(user);
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

  private checkDuplicatedNickname = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const msg = await this.authenticationService.checkDuplicatedNickname(req.body.nickname);
      res.status(200).send(msg);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
    try {
      const result = await this.authenticationService.loggingIn(logInData);
      if (result !== 'Activate 2FA') {
        const tokenData = await this.authenticationService.createToken(result);
        res.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)]);
      }
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private secondFactorAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const secondAuthData: SecondAuthDto = req.body;
    const { isCodeValid, user } = await this.authenticationService.verifyTwoFactorAuthenticationCode(secondAuthData);
    if (isCodeValid) {
      if (secondAuthData.isActivate2FAPage) {
        await this.userService.enable2FA(user.userIdx);
      }
      if (secondAuthData.isDeactivate2FAPage) {
        await this.userService.disable2FA(user.userIdx);
      }
      const tokenData = this.authenticationService.createToken(user);
      user.password = undefined;
      user.twoFactorAuthenticationCode = undefined;
      res.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)]);
      res.status(200).send(user);
    } else {
      next(new WrongOTPException());
    }
  };

  private loggingOut = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        res.setHeader('Set-Cookie', ['Authorization=deleted;HttpOnly;Path=/;Max-Age=0;Domain=.pickyplay.site']);
      } else {
        res.setHeader('Set-Cookie', ['Authorization=deleted;HttpOnly;Path=/;Max-Age=0']);
      }

      res.status(200).send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default AuthenticationController;

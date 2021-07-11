import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import authMiddleware from 'src/middleware/auth.middleware';
import UserService from 'src/services/user.service';
import { S3Upload, uploadProfileImg } from 'src/utils/imageUpload';

class UserController implements Controller {
  public path = '/user';
  public router = express.Router();
  private userService = new UserService();
  private upload = S3Upload('profile');

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 회원 정보 수정
    this.router.get(`${this.path}/QRCodeUrl`, authMiddleware, this.getQRCodeUrl);
    this.router.post(`${this.path}/newEmail`, authMiddleware, this.updateEmail);
    this.router.post(`${this.path}/newPassword`, authMiddleware, this.updatePassword);
    this.router.post(`${this.path}/newProfile`, authMiddleware, this.upload.single('image'), uploadProfileImg);
    this.router.patch(`${this.path}/Disable2FA`, authMiddleware, this.disable2FA);
  }

  private getQRCodeUrl = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const url = await this.userService.generateQRCodeURL(req.user);
      res.status(200).send(url);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private disable2FA = (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      this.userService.disable2FA(req.user.id);
      res.status(200).send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private updateEmail = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      await this.userService.updateUserEmail(req);
      res.status(200).send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private updatePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      await this.userService.updateUserPassword(req);
      res.status(200).send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default UserController;

import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import authMiddleware from 'src/middleware/auth.middleware';
import UserService from 'src/services/user.service';

class UserController implements Controller {
  public path = '/user';
  public router = express.Router();
  private userService = new UserService();
  private upload = multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, 'uploads');
      },
      filename(req, file, done) {
        // 쥐돌이.png
        const ext = path.extname(file.originalname); // 확장자 추출(.png)
        const basename = path.basename(file.originalname, ext); // 쥐돌이
        done(null, basename + '_' + new Date().getTime() + ext);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 회원 정보 수정
    this.router.get(`${this.path}/QRCodeUrl`, authMiddleware, this.getQRCodeUrl);
    this.router.post(`${this.path}/newEmail`, authMiddleware, this.updateEmail);
    this.router.post(`${this.path}/newPassword`, authMiddleware, this.updatePassword);
    this.router.post(`${this.path}/newProfile`, authMiddleware, this.upload.single('profileImg'), this.updateProfile);
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

  private updateEmail = (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private updatePassword = (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private updateProfile = (req: Request, res: Response, next: NextFunction) => {
    try {
      fs.accessSync('uploads');
      console.log(req.files);
    } catch (error) {
      fs.mkdirSync('uploads'); // 업로드 폴더가 없으므로 생성
      console.error(error);
      next(error);
    }
  };

  private disable2FA = (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      this.userService.disable2FA(req.user);
      res.status(200).send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default UserController;

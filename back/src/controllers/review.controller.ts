import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import ReviewService from 'src/services/review.service';
import multer from 'multer';
import path from 'path';

class ReviewController implements Controller {
  public path = '/review';
  public router = express.Router();
  private authenticationService = new ReviewService();
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
    this.router.post('/images', this.upload.array('postImg'), this.postImages);
  }

  private postImages = async (req: Request, res: Response, next: NextFunction) => {};
}

export default ReviewController;

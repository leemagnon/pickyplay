import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import authMiddleware from 'src/middleware/auth.middleware';
import MovieService from 'src/services/movie.service';
import { CreateLikeDto, RemoveLikeDto } from 'src/dtos/like.dto';
import { CreateReviewDto, UpdateReviewData } from 'src/dtos/review.dto';
import { S3Upload, uploadReviewImgs } from 'src/utils/imageUpload';

class MovieController implements Controller {
  public path = '/movie';
  public router = express.Router();
  private movieService = new MovieService();
  private upload = S3Upload('review');

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.patch(`${this.path}/like/:DOCID`, authMiddleware, this.addLike);
    this.router.delete(`${this.path}/like/:DOCID`, authMiddleware, this.removeLike);
    this.router.post(`${this.path}/review`, authMiddleware, this.upload.none(), this.addReview);
    this.router.post(
      `${this.path}/upload/reviewImg`,
      authMiddleware,
      this.upload.array('reviewImgs'),
      uploadReviewImgs,
    );
    this.router.delete(`${this.path}/review/:reviewIdx`, authMiddleware, this.removeReview);
    this.router.post(`${this.path}/update/review`, authMiddleware, this.updateReview);
  }

  private addLike = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const likeData: CreateLikeDto = {
      userIdx: req.user.userIdx,
      DOCID: req.params.DOCID,
    };
    try {
      const like = await this.movieService.addLike(likeData);

      if (like) {
        res.status(200).send({ likeIdx: like.likeIdx, userIdx: like.userIdx });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private removeLike = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const likeData: RemoveLikeDto = {
      DOCID: req.params.DOCID,
      userIdx: req.user.userIdx,
    };
    try {
      const result = await this.movieService.removeLike(likeData);

      if (result) {
        res.status(200).send({ userIdx: likeData.userIdx });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private addReview = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const reviewData: CreateReviewDto = {
      userIdx: req.user.userIdx,
      DOCID: req.body.DOCID,
      content: req.body.content,
    };

    let reviewImgData: string | string[];
    if (req.body.reviewImgs) {
      reviewImgData = req.body.reviewImgs;
    }

    try {
      const result = await this.movieService.addReview(reviewData, reviewImgData);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private removeReview = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const reviewData: number = parseInt(req.params.reviewIdx);
    try {
      const result = await this.movieService.removeReview(reviewData);

      if (result) {
        res.status(200).send({ reviewIdx: reviewData });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private updateReview = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const reviewData: UpdateReviewData = {
      reviewIdx: req.body.reviewIdx,
      content: req.body.content,
    };
    try {
      const result = await this.movieService.updateReview(reviewData);

      if (result) {
        res.status(200).send({ reviewIdx: reviewData.reviewIdx, content: reviewData.content });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default MovieController;

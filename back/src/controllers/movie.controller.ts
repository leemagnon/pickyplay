import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import authMiddleware from 'src/middleware/auth.middleware';
import MovieService from 'src/services/movie.service';
import { CreateLikeDto, RemoveLikeDto } from 'src/dtos/like.dto';
import { CreateReviewDto, UpdateReviewData, RemoveReviewData } from 'src/dtos/review.dto';
import { S3Upload, uploadReviewImgs } from 'src/utils/imageUpload';
import { Client } from 'elasticsearch';

class MovieController implements Controller {
  public path = '/movie';
  public router = express.Router();
  private movieService = new MovieService();
  private upload = S3Upload('review');
  public client;

  constructor() {
    this.client = new Client({
      host: process.env.ELASTIC_HOST,
      log: 'trace',
      apiVersion: '7.2',
    });
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

    const params = {
      index: 'movies-1',
      body: {
        size: 1,
        _source: [
          'DOCID._cdata',
          'posters._cdata',
          'title._cdata',
          'keywords._cdata',
          'genre._cdata',
          'actors.actor.actorNm._cdata',
        ],
        query: {
          match: { 'DOCID._cdata': `${likeData.DOCID}` },
        },
      },
    };

    try {
      const like = await this.movieService.addLike(likeData);

      if (like) {
        let result = await this.client.search(params);
        const _id = result.hits.hits[0]._id;
        result = result.hits.hits[0]._source;

        result._id = _id;
        result.posters = result.posters._cdata.trim().split('|')[0];
        result.DOCID = result.DOCID._cdata.trim();
        result.title = result.title._cdata.trim();
        result.genre = result.genre._cdata.trim();

        /**
         * keywords(출연배우) 문자열 생성
         */
        const keywordArr = result.keywords._cdata.trim().split(',');

        if (keywordArr.length > 5) {
          result.keywords = `${keywordArr[0]}, ${keywordArr[1]}, ${keywordArr[2]}, ${keywordArr[3]}, ${keywordArr[4]}`;
        } else {
          result.keywords = keywordArr.toString();
        }

        /**
         * actors(출연배우) 문자열 생성
         */
        const actorArr = [];
        if (!Object.prototype.hasOwnProperty.call(result.actors.actor, 'actorNm')) {
          for (const actor of result.actors.actor) {
            actorArr.push(actor.actorNm._cdata.trim());
          }
        } else {
          actorArr.push(result.actors.actor.actorNm._cdata.trim());
        }

        if (actorArr.length > 5) {
          result.actors = `${actorArr[0]}, ${actorArr[1]}, ${actorArr[2]}`;
        } else {
          result.actors = actorArr.toString();
        }

        res.status(200).send({ likeIdx: like.likeIdx, userIdx: like.userIdx, likedMovie: result });
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
        res.status(200).send({ userIdx: likeData.userIdx, DOCID: likeData.DOCID });
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
    const reviewData: RemoveReviewData = {
      reviewIdx: parseInt(req.params.reviewIdx),
      userIdx: req.user.userIdx,
    };

    try {
      const result = await this.movieService.removeReview(reviewData);

      if (result) {
        res.status(200).send({ reviewIdx: reviewData.reviewIdx });
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
      userIdx: req.user.userIdx,
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

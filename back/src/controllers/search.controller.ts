import express, { Request, Response, NextFunction } from 'express';
import Controller from 'src/interfaces/controller.interface';
import { Client } from 'elasticsearch';
import axios from 'axios';
// import CircularJSON from 'circular-json';
import convert from 'xml-js';
import likeModel from 'src/models/like.model';
import reviewModel from 'src/models/review.model';
import reviewImageModel from 'src/models/reviewImage.model';
import userModel from 'src/models/user.model';
import Sequelize from 'sequelize';
import authMiddleware from 'src/middleware/auth.middleware';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';

class SearchController implements Controller {
  public path = '/search';
  public router = express.Router();
  public like = likeModel;
  public review = reviewModel;
  public reviewImage = reviewImageModel;
  public user = userModel;
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
    this.router.post(`${this.path}/store`, this.storeMovies);
    this.router.get(`${this.path}/randomMovie`, this.getRandomMovie);
    this.router.get(`${this.path}/recommendedMovies`, this.getRecommendedMovies);
    this.router.get(`${this.path}/movie/:term`, this.searchMovies);
    this.router.get(`${this.path}/detail/:DOCID`, this.getDetailedMovieInfo);
    this.router.get(`${this.path}/myMovies`, authMiddleware, this.getMyMovies);
  }

  private storeMovies = async (req: Request, res: Response, next: NextFunction) => {
    const requestUrl = `${process.env.KMDB_REQ_URL}&ServiceKey=${process.env.KMDB_API_KEY}&startCount=12000&listCount=500&releaseDts=20000101`;

    try {
      // const response = await axios.get(requestUrl);
      // const jsonStr = await CircularJSON.stringify(response);
      // let movies = JSON.parse(jsonStr);
      // movies = movies.data.Data[0].Result;

      const response = await axios.get(requestUrl);
      const xmlToJson = convert.xml2json(response.data, {
        compact: true,
        spaces: 4,
      });
      const jsonObj = JSON.parse(xmlToJson);
      const movies = jsonObj.Search.Result.Row;

      for (const movie of movies) {
        await this.client.index({
          index: 'movies-2',
          body: movie,
        });
      }

      // res.send(movies);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private getRandomMovie = async (req: Request, res: Response, next: NextFunction) => {
    const params = {
      index: 'movies-1',
      body: {
        size: 9,
        _source: ['DOCID._cdata', 'title._cdata', 'stlls._cdata', 'plots.plot.plotText._cdata'],
        query: {
          bool: {
            must_not: [
              {
                term: { 'genre._cdata': '??????' },
              },
            ],
            must: [
              {
                function_score: {
                  functions: [
                    {
                      random_score: {},
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    };

    try {
      let result = await this.client.search(params);
      // stll??? ?????? ??????????????? ?????????
      result = result.hits.hits.filter((doc) => doc._source.stlls._cdata !== '  ');

      // ????????? ??????????????? stll url string ????????? ???????????? ??? ??????.
      result[0]._source.DOCID._cdata = result[0]._source.DOCID._cdata.trim();
      result[0]._source.title._cdata = result[0]._source.title._cdata.trim();
      result[0]._source.stlls._cdata = result[0]._source.stlls._cdata.trim().split('|');

      if (!Object.prototype.hasOwnProperty.call(result[0]._source.plots.plot, 'plotText')) {
        result[0]._source.plots._cdata = result[0]._source.plots.plot[0].plotText._cdata.trim();
      } else {
        result[0]._source.plots._cdata = result[0]._source.plots.plot.plotText._cdata.trim();
      }

      res.status(200).json(result[0]);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private getRecommendedMovies = async (req: Request, res: Response, next: NextFunction) => {
    /** ?????? ????????? ?????? ?????? 10??? ?????? ?????? */
    const top10Movies = [];
    /** ?????? ?????? [?????????, ???????????????, ??????, ?????????, ??????, SF, ?????????, ??????, ????????????, ?????????, ????????????, ??????] ??? ?????? 20??? ?????? */
    const genres = [
      '?????????',
      '???????????????',
      '??????',
      '?????????',
      '??????',
      'SF',
      '?????????',
      '??????',
      '????????????',
      '?????????',
      '????????????',
      '??????',
    ];
    const random = Math.floor(Math.random() * genres.length);
    const randomGenre = genres[random];

    const params2 = {
      index: 'movies-1',
      body: {
        size: 20,
        _source: [
          'DOCID._cdata',
          'title._cdata',
          'posters._cdata',
          'keywords._cdata',
          'genre._cdata',
          'actors.actor.actorNm._cdata',
        ],
        query: {
          bool: {
            should: [
              {
                match: {
                  'genre._cdata': `${randomGenre}`,
                },
              },
              {
                function_score: {
                  functions: [
                    {
                      random_score: {},
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    };

    try {
      /** 1. ?????? ????????? ?????? ?????? 10??? ?????? ?????? */
      const likes = await this.like.findAll({
        attributes: ['DOCID', [Sequelize.fn('COUNT', Sequelize.col('DOCID')), 'count']],
        group: ['DOCID'],
        order: Sequelize.literal('count DESC'),
        limit: 10,
      });

      for (const like of likes) {
        const params1 = {
          index: 'movies-1',
          body: {
            size: 1,
            _source: [
              'DOCID._cdata',
              'title._cdata',
              'posters._cdata',
              'keywords._cdata',
              'genre._cdata',
              'actors.actor.actorNm._cdata',
            ],
            query: {
              match: { 'DOCID._cdata': `${like.DOCID}` },
            },
          },
        };

        let result = await this.client.search(params1);
        const _id = result.hits.hits[0]._id;
        result = result.hits.hits[0]._source;

        result._id = _id;
        result.posters = result.posters._cdata.trim().split('|')[0];
        result.DOCID = result.DOCID._cdata.trim();
        result.title = result.title._cdata.trim();
        result.genre = result.genre._cdata.trim();

        /**
         * keywords(????????????) ????????? ??????
         */
        const keywordArr = result.keywords._cdata.trim().split(',');

        if (keywordArr.length > 5) {
          result.keywords = `${keywordArr[0]}, ${keywordArr[1]}, ${keywordArr[2]}, ${keywordArr[3]}, ${keywordArr[4]}`;
        } else {
          result.keywords = keywordArr.toString();
        }

        /**
         * actors(????????????) ????????? ??????
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

        top10Movies.push(result);
      }

      /** 2. ?????? ?????? [?????????, ???????????????, ??????, ?????????, ??????, SF, ?????????, ??????, ????????????, ?????????, ????????????, ??????] ??? ?????? 20??? ?????? */
      let result = await this.client.search(params2);
      result = result.hits.hits;

      // // ?????????, DOCID, ?????????, ?????????, ??????, ?????? ????????? ??????
      for (const doc of result) {
        doc._source.posters = doc._source.posters._cdata.trim().split('|')[0];
        doc._source.DOCID = doc._source.DOCID._cdata.trim();
        doc._source.title = doc._source.title._cdata.trim();
        doc._source.genre = doc._source.genre._cdata.trim();

        /**
         * keywords(????????????) ????????? ??????
         */
        const keywordArr = doc._source.keywords._cdata.trim().split(',');

        if (keywordArr.length > 5) {
          doc._source.keywords = `${keywordArr[0]}, ${keywordArr[1]}, ${keywordArr[2]}, ${keywordArr[3]}, ${keywordArr[4]}`;
        } else {
          doc._source.keywords = keywordArr.toString();
        }

        /**
         * actors(????????????) ?????? ??????
         */
        const actorArr = [];
        if (!Object.prototype.hasOwnProperty.call(doc._source.actors.actor, 'actorNm')) {
          for (const actor of doc._source.actors.actor) {
            actorArr.push(actor.actorNm._cdata.trim());
          }
        } else {
          actorArr.push(doc._source.actors.actor.actorNm._cdata.trim());
        }

        if (actorArr.length > 5) {
          doc._source.actors = `${actorArr[0]}, ${actorArr[1]}, ${actorArr[2]}`;
        } else {
          doc._source.actors = actorArr.toString();
        }
      }

      res.status(200).json({ top10Movies, randomMovies: result, randomGenre });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private searchMovies = async (req: Request, res: Response, next: NextFunction) => {
    const term = req.params.term;
    const params = {
      index: 'movies-1',
      body: {
        size: 50,
        _source: [
          'DOCID._cdata',
          'posters._cdata',
          'title._cdata',
          'keywords._cdata',
          'genre._cdata',
          'actors.actor.actorNm._cdata',
        ],
        query: {
          bool: {
            should: [
              {
                term: { 'title._cdata': `${term}` },
              },
              {
                term: { 'keywords._cdata': `${term}` },
              },
              {
                term: { 'genre._cdata': `${term}` },
              },
              {
                term: { 'actors.actor.actorNm._cdata': `${term}` },
              },
              {
                term: { 'plots.plot.plotText._cdata': `${term}` },
              },
            ],
          },
        },
      },
    };

    try {
      let result = await this.client.search(params);
      result = result.hits.hits;
      result = result.reduce((arr = [], doc) => {
        // ????????? ???????????? ??????
        if (arr.findIndex((v) => v._source.DOCID._cdata === doc._source.DOCID._cdata) === -1) {
          arr.push(doc);
        }
        return arr;
      }, []);

      for (const doc of result) {
        doc._source.posters._cdata = doc._source.posters._cdata.trim().split('|')[0];
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private getDetailedMovieInfo = async (req: Request, res: Response, next: NextFunction) => {
    const DOCID = req.params.DOCID;
    const params = {
      index: 'movies-1',
      body: {
        size: 1,
        _source: [
          'DOCID._cdata',
          'plots.plot.plotText._cdata',
          'prodYear._cdata',
          'rating._cdata',
          'runtime._cdata',
          'stlls._cdata',
          'title._cdata',
          'keywords._cdata',
          'genre._cdata',
          'actors.actor.actorNm._cdata',
        ],
        query: {
          match: { 'DOCID._cdata': `${DOCID}` },
        },
      },
    };

    try {
      let result = await this.client.search(params);
      result = result.hits.hits[0]._source;

      /**
       * actors(????????????) ?????? ??????
       */
      const actorArr = [];
      if (!Object.prototype.hasOwnProperty.call(result.actors.actor, 'actorNm')) {
        for (const actor of result.actors.actor) {
          actorArr.push(actor.actorNm._cdata.trim());
        }
      } else {
        actorArr.push(result.actors.actor.actorNm._cdata.trim());
      }
      result.actors = actorArr;

      /**
       * stlls(?????????) ?????? ??????
       */
      result.stlls = result.stlls._cdata.trim().split('|');

      /**
       * ?????????
       */
      result.runtime = `${result.runtime._cdata.trim()}???`;

      /**
       * plots(?????????)
       */
      if (!Object.prototype.hasOwnProperty.call(result.plots.plot, 'plotText')) {
        result.plots = result.plots.plot[0].plotText._cdata.trim();
      } else {
        result.plots = result.plots.plot.plotText._cdata.trim();
      }

      /**
       * ??? ???
       */
      const propertyArr = ['DOCID', 'keywords', 'rating', 'genre', 'prodYear', 'title'];
      for (const prop of propertyArr) {
        result[prop] = result[prop]._cdata.trim();
      }

      const reviews = await this.review.findAll({
        where: {
          DOCID,
        },
        include: [
          {
            model: this.user,
            attributes: ['userIdx', 'nickname', 'profileImgUrl'],
          },
          {
            model: this.reviewImage,
            attributes: ['reviewImgIdx', 'src'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      result.reviews = reviews;

      const likers = await this.like.findAll({
        where: {
          DOCID,
        },
        attributes: ['likeIdx', 'userIdx'],
      });

      result.likers = likers;

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private getMyMovies = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const myMovies = [];
    try {
      const likes = await this.like.findAll({ where: { userIdx: req.user.userIdx } });

      for (const like of likes) {
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
              match: { 'DOCID._cdata': `${like.DOCID}` },
            },
          },
        };

        let result = await this.client.search(params);
        const _id = result.hits.hits[0]._id;
        result = result.hits.hits[0]._source;

        result._id = _id;
        result.posters = result.posters._cdata.trim().split('|')[0];
        result.DOCID = result.DOCID._cdata.trim();
        result.title = result.title._cdata.trim();
        result.genre = result.genre._cdata.trim();

        /**
         * keywords(????????????) ????????? ??????
         */
        const keywordArr = result.keywords._cdata.trim().split(',');

        if (keywordArr.length > 5) {
          result.keywords = `${keywordArr[0]}, ${keywordArr[1]}, ${keywordArr[2]}, ${keywordArr[3]}, ${keywordArr[4]}`;
        } else {
          result.keywords = keywordArr.toString();
        }

        /**
         * actors(????????????) ????????? ??????
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

        myMovies.push(result);
      }
      res.status(200).json(myMovies);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default SearchController;

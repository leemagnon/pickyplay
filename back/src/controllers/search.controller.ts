import express, { Request, Response, NextFunction } from 'express';
import Controller from '@interfaces/controller.interface';
import { Client } from 'elasticsearch';
import axios from 'axios';
// import CircularJSON from 'circular-json';
import convert from 'xml-js';

class SearchController implements Controller {
  public path = '/search';
  public router = express.Router();
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
    this.router.get(`${this.path}/movie/:term`, this.searchMovies);
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
          index: 'movies-1',
          body: movie,
        });
      }

      res.send(movies);
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
                term: { 'genre._cdata': '공포' },
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
      // stll이 있는 도큐먼트만 필터링
      result = result.hits.hits.filter((doc) => doc._source.stlls._cdata !== '  ');

      // 첫번째 도큐먼트의 stll url string 배열로 만들어준 후 응답.
      result[0]._source.DOCID._cdata = result[0]._source.DOCID._cdata.trim();
      result[0]._source.stlls._cdata = result[0]._source.stlls._cdata.trim().split('|');

      res.status(200).json(result[0]);
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
        // 중복된 도큐먼트 제거
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
}

export default SearchController;

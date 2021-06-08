import express, { Request, Response, NextFunction } from 'express';
import Controller from '@interfaces/controller.interface';
import { Client } from 'elasticsearch';
import axios from 'axios';
import CircularJSON from 'circular-json';
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
}

export default SearchController;

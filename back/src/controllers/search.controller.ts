import express, { Request, Response, NextFunction } from 'express';
import Controller from '@interfaces/controller.interface';
import { Client } from 'elasticsearch';
import axios from 'axios';
import CircularJSON from 'circular-json';

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
    const requestUrl = `${process.env.KMDB_REQ_URL}&ServiceKey=${process.env.KMDB_API_KEY}&startCount=5500&listCount=500&releaseDts=20000101`;
    const response = await axios.get(requestUrl);
    const jsonStr = await CircularJSON.stringify(response);
    let movies = JSON.parse(jsonStr);
    movies = movies.data.Data[0].Result;

    try {
      for (const movie of movies) {
        await this.client.index({
          index: 'movies',
          body: movie,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

export default SearchController;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import 'dotenv/config';
import errorMiddleware from '@middleware/error.middleware';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import DB from './models';
import path from 'path';

class App {
  public app: express.Application;
  public port: number;
  public db: DB;

  constructor(controllers, port: number) {
    this.app = express();
    this.port = port;
    this.db = new DB();

    this.db.sequelize
      .sync()
      .then(() => {
        console.log('mysql DB 연결 성공');
      })
      .catch(console.error);
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(path.resolve(__dirname, 'config', 'config.ts'));
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser()); // string인 cookie를 object로 변환하는 미들웨어. request.cookies로 쿠키 내용에 접근 가능해진다.
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import 'dotenv/config';
import errorMiddleware from 'src/middleware/error.middleware';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import DB from 'src/models';
import path from 'path';
import helmet from 'helmet';
import hpp from 'hpp';

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
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    if (process.env.NODE_ENV === 'production') {
      this.app.use(logger('combined')); // 접속자의 ip도 알 수 있음.
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(
        cors({
          origin: 'http://pickyplay.site',
          credentials: true,
        }),
      );
    } else {
      this.app.use(logger('dev'));
      this.app.use(
        cors({
          origin: 'http://localhost:3060',
          credentials: true,
        }),
      );
    }
    this.app.use('/', express.static(path.join(__dirname, 'uploads'))); // '/' => localhost:5000
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
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

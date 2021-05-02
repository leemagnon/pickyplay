import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import errorMiddleware from '@middleware/error.middleware';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers, port: number) {
        this.app = express();
        this.port = port;

        this.connectToDatabase();
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
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
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

    private connectToDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;
          
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, { useNewUrlParser: true, useUnifiedTopology:true });
    }
}

export default App;


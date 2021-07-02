import App from 'src/app';
import AuthenticationController from 'src/controllers/authentication.controller';
import SearchController from 'src/controllers/search.controller';
import validateEnv from 'src/utils/validateEnv';
import dotenv from 'dotenv';

dotenv.config();
validateEnv();

const app = new App([new AuthenticationController(), new SearchController()], parseInt(process.env.PORT));

app.listen();

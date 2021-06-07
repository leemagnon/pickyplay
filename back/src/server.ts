import App from './app';
import AuthenticationController from 'controllers/authentication.controller';
import SearchController from 'controllers/search.controller';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new AuthenticationController(), new SearchController()], 5000);

app.listen();

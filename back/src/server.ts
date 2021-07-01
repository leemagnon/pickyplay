import App from 'src/app';
import AuthenticationController from 'src/controllers/authentication.controller';
import SearchController from 'src/controllers/search.controller';
import validateEnv from 'src/utils/validateEnv';

validateEnv();

const app = new App([new AuthenticationController(), new SearchController()], 5000);

app.listen();

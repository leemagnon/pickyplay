import App from './app';
import AuthenticationController from 'controllers/authentication.controller';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new AuthenticationController()], 5000);

app.listen();

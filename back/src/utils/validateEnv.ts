import { cleanEnv, str, port } from 'envalid';

export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: str(),
  });
}

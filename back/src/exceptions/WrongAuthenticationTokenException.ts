import HttpException from 'src/exceptions/HttpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong authentication token');
  }
}

export default WrongAuthenticationTokenException;

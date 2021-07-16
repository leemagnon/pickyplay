import HttpException from 'src/exceptions/HttpException';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(
      401,
      `권한이 없습니다. 로그인이 필요합니다. 
Authentication token missing`,
    );
  }
}

export default AuthenticationTokenMissingException;

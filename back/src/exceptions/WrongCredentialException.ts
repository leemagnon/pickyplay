import HttpException from '@exceptions/HttpException';

class WrongCredentialException extends HttpException {
  constructor() {
    super(401, '이메일 또는 비밀번호가 틀렸습니다.');
  }
}

export default WrongCredentialException;
// unauthorized

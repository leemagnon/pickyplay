import HttpException from 'src/exceptions/HttpException';

class WrongOTPException extends HttpException {
  constructor() {
    super(
      401,
      `번호가 잘못되었습니다. 
Wrong OTP.`,
    );
  }
}

export default WrongOTPException;

import HttpException from '@exceptions/HttpException';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      400,
      `${email} 이메일이 이미 존재합니다. 
User with that email ${email} already exists.`,
    );
  }
}

export default UserWithThatEmailAlreadyExistsException;

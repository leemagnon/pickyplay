import HttpException from 'src/exceptions/HttpException';

class DuplicatedNicknameException extends HttpException {
  constructor(nickname: string) {
    super(
      400,
      `${nickname} 이(가) 이미 존재합니다. 
User with that nickname ${nickname} already exists.`,
    );
  }
}

export default DuplicatedNicknameException;

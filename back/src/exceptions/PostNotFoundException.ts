import HttpException from 'src/exceptions/HttpException';

class PostNotFoundException extends HttpException {
  constructor(postIdx: number) {
    super(404, `Post with id ${postIdx} not found`);
  }
}

export default PostNotFoundException;

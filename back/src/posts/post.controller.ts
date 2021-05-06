import express, { NextFunction, Response } from 'express';
import Controller from '@interfaces/controller.interface';
import Post from '@posts/post.interface';
import postModel from '@posts/posts.model';
import mongoose from 'mongoose';
import PostNotFoundException from '@exceptions/PostNotFoundException';
import validationMiddleware from '@middleware/validation.middleware';
import authMiddleware from '@middleware/auth.middleware';
import CreatePostDto from '@posts/post.dto';
import RequestWithUser from '@interfaces/requestWithUser.interface';

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = async (req: express.Request, res: express.Response): Promise<Response> => {
    // this.post.find() => Query 인스턴스. async/await 메커니즘이 then함수를 실행할 때 간접적으로 exec를 호출한다.
    const posts: Post[] = await this.post.find().populate('author', '-password');
    return res.send(posts);
  };

  private getPostById = async (req: express.Request, res: express.Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.send('Please provide valid id');
    }
    const id = req.params.id;
    const post: Post = await this.post.findById(id);
    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private createPost = async (req: RequestWithUser, res: Response): Promise<void> => {
    const postData: CreatePostDto = req.body;
    const createdPost = new this.post({
      ...postData,
      author: req.user._id,
    });
    const savedPost = await createdPost.save();
    // Document의 인스턴스에서 populate를 호출한다. 실행시키려면 execPopulate를 호출해야한다.
    await savedPost.populate('author', '-password').execPopulate();
    res.send(savedPost);
  };

  private modifyPost = async (req: express.Request, res: express.Response, next: NextFunction) => {
    const id = req.params.id;
    const postData: Post = req.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private deletePost = async (req: express.Request, res: express.Response, next: NextFunction) => {
    const id = req.params.id;
    const successResponse = await this.post.findByIdAndDelete(id);
    if (successResponse) {
      res.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostsController;

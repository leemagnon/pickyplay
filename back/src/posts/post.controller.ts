import express, { NextFunction, Response } from 'express';
import Controller from '@interfaces/controller.interface';
import Post from '@posts/post.interface';
import postModel from '@posts/posts.model';
import mongoose from 'mongoose';
import PostNotFoundException from '@exceptions/PostNotFoundException';
import validationMiddleware from '@middleware/validation.middleware';
import CreatePostDto from '@posts/post.dto';

class PostsController implements Controller {
    public path = "/posts";
    public router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
    }

    private getAllPosts = async (req: express.Request, res: express.Response): Promise<Response> => {
        const posts: Post[] = await this.post.find().exec();
        return res.send(posts);
    }

    private getPostById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.send("Please provide valid id");
        }
        const id = req.params.id;
        const post: Post = await this.post.findById(id);
        if (post) {
            res.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private createPost = async (req: express.Request, res: express.Response): Promise<void> => {
        const postData: Post = req.body;
        const createdPost = new this.post(postData);
        const savedPost = await createdPost.save();
        res.send(savedPost);
    }

    private modifyPost = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const id = req.params.id;
        const postData: Post = req.body;
        const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
        if (post) {
            res.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private deletePost = async (req: express.Request, res: express.Response, next: NextFunction) => {
        const id = req.params.id;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            res.send(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostsController;
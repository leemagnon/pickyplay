import express, { Response } from 'express';
import Controller from '@interfaces/controller.interface';
import Post from '@posts/post.interface';
import postModel from '@posts/posts.model';

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
        this.router.post(this.path, this.createPost);
        this.router.patch(`${this.path}/:id`, this.modifyPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
    }

    private getAllPosts = async (req: express.Request, res: express.Response): Promise<Response> => {
        const posts: Post[] = await this.post.find().exec();
        return res.send(posts);
    }

    private getPostById = async (req: express.Request, res: express.Response): Promise<Response> => {
        const id = req.params.id;
        const post: Post = await this.post.findById(id);
        return res.send(post);
    }

    private createPost = async (req: express.Request, res: express.Response): Promise<void> => {
        const postData: Post = req.body;
        const createdPost = new this.post(postData);
        const savedPost = await createdPost.save();
        res.send(savedPost);
    }

    private modifyPost = async (req: express.Request, res: express.Response): Promise<void> => {
        const id = req.params.id;
        const postData: Post = req.body;
        const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
        res.send(post);
    }

    private deletePost = async (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            res.send(200);
        } else {
            res.send(404);
        }
    }
}

export default PostsController;
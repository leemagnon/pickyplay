import App from './app';
import PostsController from './posts/post.controller';

const app = new App([
    new PostsController(),
], 5000);

app.listen();
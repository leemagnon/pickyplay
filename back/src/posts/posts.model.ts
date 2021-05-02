import mongoose from 'mongoose';
import Post from '@posts/post.interface';

const postSchema = new mongoose.Schema({
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
    content: String,
    title: String,
});

// <Post & mongoose.Document> 를 통해 타입스크립트가 interface에 정의해놓은 필드들을 인식할 수 있다.
const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;
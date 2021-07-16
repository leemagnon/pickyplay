import { CreateLikeDto, RemoveLikeDto } from 'src/dtos/like.dto';
import { CreateReviewDto, UpdateReviewData } from 'src/dtos/review.dto';
import likeModel from 'src/models/like.model';
import reviewModel from 'src/models/review.model';
import reviewImageModel from 'src/models/reviewImage.model';
import userModel from 'src/models/user.model';

class MovieService {
  public user = userModel;
  public like = likeModel;
  public review = reviewModel;
  public reviewImage = reviewImageModel;

  public async addLike(likeData: CreateLikeDto) {
    try {
      const user = await this.user.findOne({ where: { userIdx: likeData.userIdx } });
      const like = await this.like.create(likeData);
      await user.$add('likes', like);

      return like;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async removeLike(likeData: RemoveLikeDto) {
    try {
      await this.like.destroy({ where: { userIdx: likeData.userIdx, DOCID: likeData.DOCID } });

      return 'deleted successfully';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addReview(reviewData: CreateReviewDto, reviewImgData = null) {
    try {
      const user = await this.user.findOne({ where: { userIdx: reviewData.userIdx } });
      const review = await this.review.create(reviewData);
      await user.$add('reviews', review);

      if (reviewImgData) {
        if (Array.isArray(reviewImgData)) {
          const images = await Promise.all(reviewImgData.map((image) => this.reviewImage.create({ src: image })));
          await review.$add('images', images);
        } else {
          const image = await this.reviewImage.create({ src: reviewImgData });
          await review.$add('images', image);
        }
      }

      const fullReview = await this.review.findOne({
        where: { reviewIdx: review.reviewIdx },
        include: [
          {
            model: this.user,
            attributes: ['userIdx', 'nickname', 'profileImgUrl'],
          },
          {
            model: this.reviewImage,
            attributes: ['reviewImgIdx', 'src'],
          },
        ],
      });

      return fullReview;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async removeReview(reviewIdx: number) {
    try {
      await this.reviewImage.destroy({ where: { reviewIdx } });
      await this.review.destroy({ where: { reviewIdx } });

      return 'deleted successfully';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateReview(reviewData: UpdateReviewData) {
    try {
      await this.review.update({ content: reviewData.content }, { where: { reviewIdx: reviewData.reviewIdx } });

      return 'updated successfully';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default MovieService;

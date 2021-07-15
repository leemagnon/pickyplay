import { Sequelize } from 'sequelize-typescript';
import * as config from 'src/config/config';
import User from 'src/models/user.model';
import Review from 'src/models/review.model';
import ReviewImage from 'src/models/reviewImage.model';
import Like from 'src/models/like.model';

export default class DB {
  public sequelize: Sequelize;
  public env;

  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.sequelize = new Sequelize(config[this.env]);
    this.sequelize.addModels([User, Review, ReviewImage, Like]);
  }
}

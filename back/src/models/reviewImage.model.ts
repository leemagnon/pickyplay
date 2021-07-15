import {
  Table,
  Model,
  DataType,
  Column,
  AllowNull,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import Review from './review.model';

@Table
export default class ReviewImage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  reviewImgIdx: number;

  @ForeignKey(() => Review)
  @Column(DataType.INTEGER)
  reviewIdx: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  src: string;

  @BelongsTo(() => Review)
  review: Review;
}

import {
  Table,
  Model,
  DataType,
  Column,
  AllowNull,
  ForeignKey,
  PrimaryKey,
  HasMany,
  BelongsTo,
  AutoIncrement,
} from 'sequelize-typescript';
import User from 'src/models/user.model';
import ReviewImage from 'src/models/reviewImage.model';

@Table
export default class Review extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  reviewIdx: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userIdx: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  DOCID: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ReviewImage)
  images: ReviewImage[];
}

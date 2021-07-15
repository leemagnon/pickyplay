import {
  Table,
  Model,
  Column,
  AllowNull,
  ForeignKey,
  PrimaryKey,
  DataType,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import User from 'src/models/user.model';

@Table
export default class Like extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  likeIdx: number;

  @ForeignKey(() => User)
  @Column({
    unique: 'userIdx_DOCID_Like',
  })
  userIdx: number;

  @AllowNull(false)
  @Column({
    unique: 'userIdx_DOCID_Like',
  })
  DOCID: string;

  @BelongsTo(() => User)
  user: User;
}

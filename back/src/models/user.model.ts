import bcrypt from 'bcrypt';
import {
  Table,
  Model,
  DataType,
  Unique,
  IsEmail,
  Column,
  Length,
  BeforeUpdate,
  BeforeCreate,
  AllowNull,
  Default,
  AutoIncrement,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import Review from 'src/models/review.model';
import Like from 'src/models/like.model';

@Table
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userIdx: number;

  @IsEmail
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(30))
  email: string;

  @Length({ min: 8, max: 20 })
  @AllowNull(false)
  @Column
  password: string;

  @Column(DataType.STRING)
  twoFactorAuthenticationCode: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is2FAOn: boolean;

  @Length({ min: 2, max: 10 })
  @AllowNull(false)
  @Unique
  @Column
  nickname: string;

  @Column(DataType.STRING)
  profileImgUrl: string;

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Like)
  likes: Like[];

  @BeforeUpdate
  @BeforeCreate
  static async encryptPassword(instance: User) {
    instance.password = await bcrypt.hash(instance.password, 10);
  }
}

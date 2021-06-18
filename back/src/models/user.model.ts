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
} from 'sequelize-typescript';

@Table
export default class User extends Model {
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

  @Length({ min: 2, max: 10 })
  @Unique
  @Column
  nickname: string;

  @Column(DataType.STRING)
  profileImgUrl: string;

  @Column(DataType.TEXT)
  introWords: string;

  @BeforeUpdate
  @BeforeCreate
  static async encryptPassword(instance: User) {
    instance.password = await bcrypt.hash(instance.password, 10);
  }
}

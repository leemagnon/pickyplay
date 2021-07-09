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

  @BeforeUpdate
  @BeforeCreate
  static async encryptPassword(instance: User) {
    console.log('왜 실행 안 됨?');
    instance.password = await bcrypt.hash(instance.password, 10);
  }
}

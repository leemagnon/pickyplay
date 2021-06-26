import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(10)
  public nickname: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  public password: string;
}

export default CreateUserDto;

import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

class LogInDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  public password: string;
}

export default LogInDto;

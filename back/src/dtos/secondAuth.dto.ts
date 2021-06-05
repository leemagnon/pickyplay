import { IsString, IsEmail } from 'class-validator';

class SecondAuthDto {
  @IsEmail()
  public email: string;

  @IsString()
  public twoFactorAuthenticationCode: string;
}

export default SecondAuthDto;

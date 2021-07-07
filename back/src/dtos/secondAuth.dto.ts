import { IsString, IsEmail, IsOptional } from 'class-validator';

class SecondAuthDto {
  @IsEmail()
  public email: string;

  @IsString()
  public twoFactorAuthenticationCode: string;

  @IsOptional()
  @IsString()
  public isActivate2FAPage: string;

  @IsOptional()
  @IsString()
  public isDeactivate2FAPage: string;
}

export default SecondAuthDto;

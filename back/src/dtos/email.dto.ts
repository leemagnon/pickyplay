import { IsString, IsEmail } from 'class-validator';

class EmailDto {
  @IsEmail()
  public receiverEmail: string;

  @IsString()
  public emailAuthCode: string;
}

export default EmailDto;

import { IsString } from 'class-validator';

class TwoFactorAuthenticationDto {
    @IsString()
    public twoFactorAuthenticationCode: string;

    @IsString()
    public email: string;
}

export default TwoFactorAuthenticationDto;
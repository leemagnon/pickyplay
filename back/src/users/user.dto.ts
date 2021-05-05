import { IsEmail, IsString, IsOptional, ValidateNested, MinLength, MaxLength, } from 'class-validator';
import CreateAddressDto from '@users/address.dto';

class CreateUserDto {
    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    public password: string;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}

export default CreateUserDto;
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import CreateAddressDto from '@users/address.dto';

class CreateUserDto {
    @IsString()
    public email: string;

    @IsString()
    public password: string;

    @IsString()
    public nickname: string;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}

export default CreateUserDto;
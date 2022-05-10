import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Matches} from 'class-validator';

export class LoginSocialUserDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    social_access_token:string;

}

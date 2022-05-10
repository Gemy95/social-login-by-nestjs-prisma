import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Matches} from 'class-validator';

export class OtpUserDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    phone:string;

    @ApiProperty({default:"1111"})
    @IsString()
    @IsNotEmpty()
    otp:string;

}

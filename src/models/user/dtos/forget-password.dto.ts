import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class ForgetPasswordVerifyDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    phone:string;

    @ApiProperty({default:"1111"})
    @IsString()
    @IsNotEmpty()
    otp:string;

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+|\?~=.-])(?=.*[A-Z])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+|\?~=.-]{8,}$/,
     { message: 'incorrect new password' })
    new_password:string;

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+|\?~=.-])(?=.*[A-Z])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+|\?~=.-]{8,}$/,
     { message: 'incorrect confirm password' })
    @Match('new_password',{"message":"new passwords don't match"})
    confirm_password:string;

}

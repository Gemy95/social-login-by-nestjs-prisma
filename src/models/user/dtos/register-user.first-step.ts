import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, Matches, IsEnum, IsOptional} from 'class-validator';
import { Providers } from 'src/helpers/providers.helper';
import { UserStatus } from 'src/helpers/user-status.helper';

export class RegisterUserFirstStepDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    phone:string;

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+|\?~=.-])(?=.*[A-Z])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+|\?~=.-]{8,}$/,
    { message: 'invalid password' })
    password:string;

}

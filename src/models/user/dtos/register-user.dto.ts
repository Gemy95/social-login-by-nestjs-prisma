import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, Matches, IsEnum, IsOptional, IsDate} from 'class-validator';
import { Genders } from 'src/helpers/genders.helper';
import { Providers } from 'src/helpers/providers.helper';
import { UserStatus } from 'src/helpers/user-status.helper';
export class RegisterUserDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    full_name:string;

    @ApiProperty({default:""})
    @IsEmail()
    @IsNotEmpty()
    email:string;

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

    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    picture_url?:string

    @ApiProperty({default:"1995-08-08"})
    @IsOptional()
    @Transform( ({ value }) => new Date(value))
    @IsDate()    
    birth_date?:Date;

    @ApiProperty({default:UserStatus.PENDING_OTP})
    @IsEnum(UserStatus)
    @IsString()
    @IsNotEmpty()
    status:UserStatus

    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    referral?:string

    @ApiProperty({default:Providers.NONE})
    @IsEnum(Providers)
    @IsString()
    @IsOptional()
    provider?:Providers

    @ApiProperty({default:Genders.MALE})
    @IsString()
    @IsOptional()
    gender?:Genders

}

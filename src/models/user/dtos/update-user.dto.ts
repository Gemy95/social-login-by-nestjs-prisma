import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, Matches, IsEnum, IsOptional, IsDate} from 'class-validator';
import { Genders } from 'src/helpers/genders.helper';
import { UserStatus } from 'src/helpers/user-status.helper';

export class UpdateUserDto {

    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    full_name?:string;


    @ApiProperty({default:""})
    @IsOptional()
    @IsEmail()
    email?:string;
    
    /*
    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    phone?:string;
    */
    
    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    picture_url?:string

    @ApiProperty({default:"1995-08-08"})
    @IsOptional()
    @Transform( ({ value }) => new Date(value))
    @IsDate()    
    birth_date?:Date;

    /*
    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    referral?:string
    */

    @ApiProperty({default:Genders.MALE})
    @IsString()
    @IsOptional()
    gender?:Genders

}

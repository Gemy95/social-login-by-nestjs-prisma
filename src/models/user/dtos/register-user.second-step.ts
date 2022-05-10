import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsDate} from 'class-validator';
import { Genders } from 'src/helpers/genders.helper';

export class RegisterUserSecondStepDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    phone:string;

    @ApiProperty({default:""})
    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    full_name:string;
    
    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    picture_url:string

    @ApiProperty({default:Genders.MALE})
    @IsString()
    @IsNotEmpty()
    gender:Genders

    @ApiProperty({default:"1995-08-08"})
    @Transform( ({ value }) => new Date(value))
    @IsDate()    
    @IsNotEmpty()
    birth_date:Date;

    @ApiProperty({default:""})
    @IsString()
    @IsOptional()
    referral?:string

}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, Matches, IsEnum, IsOptional} from 'class-validator';
import { Providers } from 'src/helpers/providers.helper';


export class RegisterSocialUserFirstStepDto {

    @ApiProperty({default:""})
    @IsString()
    @IsNotEmpty()
    social_access_token:string;

    @ApiProperty({default:Providers.GOOGLE})
    @IsEnum(Providers)
    @IsNotEmpty()
    provider:Providers

}

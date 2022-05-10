import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtAuthService } from '../../auth/jwt-auth/jwt-auth.service';
import { Providers } from 'src/helpers/providers.helper';
import { UserParser } from './user.parse';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { getRandomOtp } from 'src/helpers/otp.helper';
import { ForgetPasswordVerifyDto } from './dtos/forget-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { getReferral } from 'src/helpers/referral.helper';
import { OtpUserDto } from './dtos/otp-user';
import { UserStatus } from 'src/helpers/user-status.helper';
import { RegisterUserSecondStepDto } from './dtos/register-user.second-step';
import { RegisterUserFirstStepDto } from './dtos/register-user.first-step';
import { RegisterSocialUserFirstStepDto } from './dtos/register-social-user.first-step.dto';
import { RegisterSocialUserSecondStepDto } from './dtos/register-social-user.second-step.dto';
import { CustomError } from '../../custom-error/handlling-custom-error';
import { LoginSocialUserDto } from './dtos/login-social-user.dto';
import { Genders } from 'src/helpers/genders.helper';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class UserService {
    constructor(private prismaService:PrismaService, private jwtAuthService:JwtAuthService,
        private mailService:MailService){}


    async registerUserFirstStep(userObj:RegisterUserFirstStepDto){
        
       const checkUserExists = await this.prismaService.user.findUnique({where:{phone:userObj.phone}});

       if(checkUserExists){
           throw new HttpException ("phone already exists",HttpStatus.BAD_REQUEST);
       }

       const hashed_password = await bcrypt.hash(userObj.password, 10);
       userObj['password']= hashed_password;

       const user= await this.prismaService.user.create({"data":{...userObj,provider:Providers.NONE,
                   status:UserStatus.PENDING_OTP}}); 
                   
    }


    async checkOtpUser(otpObj:OtpUserDto){

        const checkUserExists= await this.prismaService.user.findFirst({where:{phone:otpObj.phone}});

        if(!checkUserExists){
            throw new HttpException("not found user by this phone", HttpStatus.BAD_REQUEST);
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.ACTIVE){
            throw CustomError.USER_IS_ACTIVE();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.INACTIVE){
            throw CustomError.USER_IS_INACTIVE();
        } 

        if(checkUserExists && checkUserExists?.status == UserStatus.PENDING_COMPLETE_PROFILE){
            throw CustomError.USER_COMPLETE_PROFILE();
        }

        const otp =/* await this.prismaService.verification.findFirst({where:{
            user:{
                phone:otpObj.phone
            }
        }}) */ "1111";

        if(otpObj.otp == otp){
            await this.prismaService.user.update({where:{phone:otpObj.phone},data:{status:UserStatus.PENDING_COMPLETE_PROFILE}});
        }else{
            throw new HttpException("wrong otp, please try again", HttpStatus.BAD_REQUEST);
        }

        delete checkUserExists.password;

        return {user:checkUserExists}
    }


    async registerUserSecondStep(userObj:RegisterUserSecondStepDto){
        
        const checkUserExists = await this.prismaService.user.findUnique({where:{phone:userObj.phone}});

        if(!checkUserExists){
            throw new HttpException("not found user by this phone", HttpStatus.BAD_REQUEST);
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.PENDING_OTP){
            throw CustomError.USER_VERIFY_OTP();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.ACTIVE){
            throw CustomError.USER_IS_ACTIVE();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.INACTIVE){
            throw CustomError.USER_IS_INACTIVE();
        } 

        const referral = userObj.referral;

        userObj.referral = getReferral();

        const user = await this.prismaService.user.update({where:{phone:userObj.phone},data:{...userObj,
        status:UserStatus.ACTIVE}});
         
        delete user.password;   

        const tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens(
            new UserParser().setId(checkUserExists.id).setPhone(checkUserExists.phone)
            .setEmail(checkUserExists.email).setProvider(Providers.NONE)
            );
        
        return {...tokens, user:checkUserExists};

     }


    async loginUser(loginObj:LoginUserDto){

        const checkUserExists = await this.prismaService.user.findFirst({where:{phone:loginObj.phone}});

        if(!checkUserExists){
            throw new HttpException ("phone not exists",HttpStatus.BAD_REQUEST);
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.PENDING_OTP){  
            throw CustomError.USER_VERIFY_OTP();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.PENDING_COMPLETE_PROFILE){
            throw CustomError.USER_COMPLETE_PROFILE();
        }

        if(checkUserExists && checkUserExists?.provider != Providers.NONE){
            throw CustomError.USER_SOCIAL_MEDIA_LOGIN();
        }

        // if(checkUserExists && checkUserExists?.status == UserStatus.INACTIVE){
        //     throw CustomError.USER_IS_INACTIVE();
        // } 

       const verfiy_password = await bcrypt.compare(loginObj.password,checkUserExists.password);

       if(!verfiy_password){
           throw new HttpException ("wrong password",HttpStatus.BAD_REQUEST);
       }
       
        delete checkUserExists.password;

        const tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens(
            new UserParser().setId(checkUserExists.id).setPhone(checkUserExists.phone)
            .setEmail(checkUserExists.email).setProvider(Providers.NONE)
            );
        
        return {...tokens, user:checkUserExists};

    } 


    async resetUserPassword(phone:string,resetPasswordDto:ResetPasswordDto){
       
        const user= await this.prismaService.user.findFirst({where:{phone,status:UserStatus.ACTIVE}});

        if(!user){
            throw new HttpException ("user not exists or not active",HttpStatus.BAD_REQUEST);
        }

        const verfiy_password = await bcrypt.compare(resetPasswordDto.old_password,user.password);
      
        if(!verfiy_password){
            throw new HttpException ("wrong password",HttpStatus.BAD_REQUEST);
         }

         const hashed_password = await bcrypt.hash(resetPasswordDto.new_password, 10);

         await this.prismaService.user.update({where:{phone},data:{password:hashed_password}});

    }


    async forgetUserPasswordSend(phone:string){
    
        const user= await this.prismaService.user.findFirst({where:{phone,status:UserStatus.ACTIVE}});

        if(!user){
            throw new HttpException ("user not exists or not active",HttpStatus.BAD_REQUEST);
        }

        const otp = getRandomOtp();

        await this.mailService.sendEmail(user.email,"Verfication OTP",'forget-password',{otp});

    }
    

    async forgetUserPasswordVerify(forgetPasswordVerifyDto:ForgetPasswordVerifyDto){

        const user= await this.prismaService.user.findFirst({where:{"phone":forgetPasswordVerifyDto.phone,status:UserStatus.ACTIVE}});

        if(!user){
            throw new HttpException ("user not exists or not active",HttpStatus.BAD_REQUEST);
        }
       
        const last_otp_user = {code:"1111"};

    
        if(last_otp_user.code != "1111" /*forgetPasswordVerifyDto.otp*/){
            throw new HttpException ("wrong otp",HttpStatus.BAD_REQUEST);
        }

         const hashed_password = await bcrypt.hash(forgetPasswordVerifyDto.new_password, 10);

         await this.prismaService.user.update({where:{phone:forgetPasswordVerifyDto.phone},data:{password:hashed_password,
            provider: Providers.NONE}});

    }
    

    async updateUser(id:number,updateUserDto:UpdateUserDto){
        const user=await this.prismaService.user.update({where:{id},data:{...updateUserDto}});
        delete user.password;
        return { user };
    }


    async getUserStatus(phone:string){
        const user= await this.prismaService.user.findUnique({where:{phone},select:{status:true}});
        if(!user){
            throw new HttpException ("user not exists",HttpStatus.BAD_REQUEST);
        }
        return {status:user.status};
    }


    async registerSocialUserFirstStep(userObj:RegisterSocialUserFirstStepDto){
        const checkUserExists = await this.prismaService.user.findUnique({where:{social_access_token: userObj.social_access_token}});

       if(checkUserExists){
           throw new HttpException ("user already exists",HttpStatus.BAD_REQUEST);
       }

       const user= await this.prismaService.user.create({"data":{...userObj,
        status:UserStatus.PENDING_COMPLETE_PROFILE}}); 

    }


    async registerSocialUserSecondStep(userObj:RegisterSocialUserSecondStepDto){
        
        const checkUserExists = await this.prismaService.user.findUnique({where:{social_access_token:userObj.social_access_token}});

        if(!checkUserExists){
            throw new HttpException("not found user", HttpStatus.BAD_REQUEST);
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.PENDING_COMPLETE_PROFILE){
            throw CustomError.USER_COMPLETE_PROFILE();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.ACTIVE){
            throw CustomError.USER_IS_ACTIVE();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.INACTIVE){
            throw CustomError.USER_IS_INACTIVE();
        } 

        const referral = userObj.referral;

        userObj.referral = getReferral();

        const user = await this.prismaService.user.update({where:{social_access_token:userObj.social_access_token}
        ,data:{...userObj,
        status:UserStatus.ACTIVE}});

        delete user.password;   

        const tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens(
            new UserParser().setId(checkUserExists.id).setPhone(checkUserExists.phone)
            .setEmail(checkUserExists.email).setProvider(checkUserExists.provider)
            );
        
        return {...tokens, user:checkUserExists};
     }


     async loginSocialUser(loginObj:LoginSocialUserDto){

        const checkUserExists = await this.prismaService.user.findFirst({where:{social_access_token:loginObj.social_access_token}});

        if(!checkUserExists){
            throw new HttpException ("user not exists",HttpStatus.BAD_REQUEST);
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.PENDING_COMPLETE_PROFILE){
            throw CustomError.USER_COMPLETE_PROFILE();
        }

        if(checkUserExists && checkUserExists?.status == UserStatus.INACTIVE){
            throw CustomError.USER_IS_INACTIVE();
        }

        delete checkUserExists.password;

        const tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens(
            new UserParser().setId(checkUserExists.id).setPhone(checkUserExists.phone)
            .setEmail(checkUserExists.email).setProvider(checkUserExists.provider)
            );
        
        return {...tokens, user:checkUserExists};

    }  

}

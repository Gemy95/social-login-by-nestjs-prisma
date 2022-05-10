import { Controller, Post, ValidationPipe , Body, Get, HttpException, HttpStatus, UseGuards, Patch, Req, Query, Put, ParseIntPipe, UseInterceptors, Delete, DefaultValuePipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LoginUserDto } from './dtos/login-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserService } from './user.service';
import { ForgetPasswordVerifyDto } from './dtos/forget-password.dto';
import { Request } from 'express';
import { UpdateUserDto } from './dtos/update-user.dto';
import { OtpUserDto } from './dtos/otp-user';
import { RegisterUserFirstStepDto } from './dtos/register-user.first-step';
import { RegisterUserSecondStepDto } from './dtos/register-user.second-step';
import { JwtAuthService } from 'src/auth/jwt-auth/jwt-auth.service';
import { RefreshTokenDto } from 'src/auth/jwt-auth/dtos/refresh-token.dto';
import { RegisterSocialUserFirstStepDto } from './dtos/register-social-user.first-step.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { RegisterSocialUserSecondStepDto } from './dtos/register-social-user.second-step.dto';
import { LoginSocialUserDto } from './dtos/login-social-user.dto';

@ApiTags('User APIs')
@Controller()
export class UserController {

    constructor(private userService:UserService, private jwtAuthService:JwtAuthService, private readonly i18n: I18nService){}
  
    
    //@ApiBearerAuth()
    //@UseGuards(JwtAuthGuard)
    @Get('/user/sayHello')
    async testUser(@I18nLang() lang: string){
       try{
          return { data:this.i18n.translate('user.HELLO_MESSAGE', {lang,  args: { username: 'Ali' } })};
       }
      catch(error){
         throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }


    @Post('/user/register/first-step')
    async registerUserFirstStep(@Body(new ValidationPipe({ transform: true })) userObj:RegisterUserFirstStepDto){
      const data= await this.userService.registerUserFirstStep(userObj);
      return {data, message:"now, verify your account by otp" };
    }


   @Post('/user/verify/otp')
   async checkUserOtp(@Body(new ValidationPipe({ transform: true })) otpObj:OtpUserDto){
      const data= await this.userService.checkOtpUser(otpObj);
      return {data, message:"user otp success, and now complete your profile" };
   }


   @Post('/user/register/second-step')
   async registerUserSecondStep(@Body(new ValidationPipe({ transform: true })) userObj:RegisterUserSecondStepDto){
      const data= await this.userService.registerUserSecondStep(userObj);
      return {data, message:"now, user profile completed successfully"};
   }
   

    @Post('/user/login')
    async loginUser(@Body(new ValidationPipe({ transform: true })) loginObj:LoginUserDto){
       const data= await this.userService.loginUser(loginObj);
       return {data,message:"data retrieved successfully"};
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('/user/reset-password')
    async resetUserPassword(@Req() req: Request,@Body(new ValidationPipe({ transform: true })) resetPasswordDto:ResetPasswordDto){
        await this.userService.resetUserPassword(req['user']['phone'],resetPasswordDto);
        return { "message":"user reset password successfully" }
    }


    @ApiQuery({name:"phone",required:true,example:"12345"})
    @Get('/user/forget-password/sendOtp')
    async forgetUserPasswordSend(@Query('phone') phone:string){
       await this.userService.forgetUserPasswordSend(phone);
       return { "message":"user otp send successfully" }
    }


    @Patch('/user/forget-password/')
    async forgetUserPasswordVerify(@Body(new ValidationPipe({ transform: true })) forgetPasswordVerifyDto:ForgetPasswordVerifyDto){
       await this.userService.forgetUserPasswordVerify(forgetPasswordVerifyDto);
       return { "message":"user forget password successfully" }
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/user/update')
    async updateUser(@Body(new ValidationPipe({ transform: true })) updateUserDto:UpdateUserDto, @GetUser() user){
       const data= await this.userService.updateUser(user['id'],updateUserDto );
       return {data}
    }

    
    @ApiQuery({name:"phone",required:true,example:"12345"})
    @Get('/user/getStatus')
    async getUserStatus(@Query('phone') phone:string){
      const data= await this.userService.getUserStatus(phone);
       return {data};
    }


    @Post('/user/refresh-token')
    async getUserAccessTokenFromRefersh(@Body(new ValidationPipe({ transform: true })) tokenObject:RefreshTokenDto) {
      const data= await this.jwtAuthService.getUserAccessTokenFromRefresh(tokenObject['refresh_token']);
      return {data,message:"data retrieved successfully"};
   }


   @Post('/user/register/social-first-step')
   async registerSocialUserFirstStep(@Body(new ValidationPipe({ transform: true })) userObj:RegisterSocialUserFirstStepDto){
     const data= await this.userService.registerSocialUserFirstStep(userObj);
     return {data, message:"now, complete your profile" };
   }


   @Post('/user/register/social-second-step')
   async registerSocialUserSecondStep(@Body(new ValidationPipe({ transform: true })) userObj:RegisterSocialUserSecondStepDto){
      const data= await this.userService.registerSocialUserSecondStep(userObj);
      return {data, message:"now, user profile completed successfully"};
   }


   @Post('/user/social-login')
    async loginSocialUser(@Body(new ValidationPipe({ transform: true })) loginObj:LoginSocialUserDto){
       const data= await this.userService.loginSocialUser(loginObj);
       return {data,message:"data retrieved successfully"};
    }

}
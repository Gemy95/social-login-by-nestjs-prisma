import { Strategy , Profile } from 'passport-twitter'
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Providers } from 'src/helpers/providers.helper';
import { UserParser } from 'src/models/user/user.parse';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';
import { UserStatus } from 'src/helpers/user-status.helper';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, "twitter") {
  constructor(
    configService:ConfigService,
    private jwtAuthService: JwtAuthService,
  ) {
    super({ 
      consumerKey: configService.get<string>('TWITTER_APP_ID'),
      consumerSecret: configService.get<string>('TWITTER_APP_SECRET'),
      callbackURL: configService.get<string>('TWITTER_APP_REDIRECT_URL'),
      includeEmail: true
    });
  }

  async validate(token: string, secret: string, profile:Profile ,done:any) {
    try{
      const user = new UserParser().setProvider(Providers.TWITTER)
      .setFullName(profile._json.first_name + " " + profile._json.last_name)
      .setPictureUrl(profile.photos[0].value).setStatus(UserStatus.ACTIVE);
       const jwt_tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens (user);
       return {...jwt_tokens , ...user};
    } catch (error) {
    throw new HttpException(error, HttpStatus.BAD_REQUEST);
   }
  }
}
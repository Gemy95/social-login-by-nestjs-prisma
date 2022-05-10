import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';
import { UserParser } from 'src/models/user/user.parse';
import { Providers } from 'src/helpers/providers.helper';
import { UserStatus } from 'src/helpers/user-status.helper';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    private jwtAuthService: JwtAuthService,
  ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get<string>('OAUTH_GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    try {
       const user = new UserParser().setProvider(Providers.GOOGLE).setFullName(profile._json.first_name + " " + profile._json.last_name)
      .setEmail(profile._json.email).setPictureUrl(profile._json.picture).setStatus(UserStatus.ACTIVE);
       const jwt_tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens (user);
       return {...jwt_tokens , ...user};
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}

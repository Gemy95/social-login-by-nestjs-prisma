import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UserStatus } from "@prisma/client";
import { Profile, Strategy } from "passport-apple";
import { Providers } from "src/helpers/providers.helper";
import { UserParser } from "src/models/user/user.parse";
import { JwtAuthService } from "../jwt-auth/jwt-auth.service";

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, "apple") {
  constructor( 
      configService:ConfigService,
      private jwtAuthService: JwtAuthService,
    ) {
    super({
      clientID: configService.get<string>('APPLE_APP_ID'),
      clientSecret: configService.get<string>('APPLE_APP_SECRET'),
      callbackURL: configService.get<string>('APPLE_APP_REDIRECT_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    try{
      const user = new UserParser().setProvider(Providers.APPLE).setFullName(profile._json.first_name + " " + profile._json.last_name)
     .setEmail(profile._json.email).setPictureUrl(profile.profileUrl).setStatus(UserStatus.ACTIVE);
      const jwt_tokens= await this.jwtAuthService.checkingUserExistsAndGetTokens (user);
      return {...jwt_tokens , ...user};
   } catch (error) {
    throw new HttpException(error, HttpStatus.BAD_REQUEST);
  }
  }
}
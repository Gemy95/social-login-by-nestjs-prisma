import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOauthModule } from './auth/google-oauth/google-oauth.module';
import { JwtAuthModule } from './auth/jwt-auth/jwt-auth.module';
import { UserModule } from './models/user/user.module';
import { FacebookAuthModule } from './auth/facebook-auth/facebook-auth.module';
import { TwitterAuthModule } from './auth/twitter-auth/twitter-auth.module';
import { InstagramAuthModule } from './auth/instagram-auth/instagram-auth.module';
import { AcceptLanguageResolver ,I18nModule ,QueryResolver, } from 'nestjs-i18n';
import { AppleAuthModule } from './auth/apple-auth/apple-auth.module';
import { MailModule } from './mail/mail.module';
import * as path from 'path';
import 'dotenv/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtAuthModule,
    UserModule,
    GoogleOauthModule,
    FacebookAuthModule,
    TwitterAuthModule,
    InstagramAuthModule,
    AppleAuthModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'ar-*': 'ar',
        pt: 'pt-BR',
      },
      loaderOptions: {
        path: path.join(__dirname, '/../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver, // read language from http request
      ],
    }),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
 
}

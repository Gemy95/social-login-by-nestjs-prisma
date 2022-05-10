import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { GoogleOauthService } from './google-oauth.service';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy, GoogleOauthService,PrismaService],
})
export class GoogleOauthModule {}
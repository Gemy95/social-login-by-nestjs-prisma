import { Module } from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { TwitterAuthController } from './twitter-auth.controller';
import { TwitterStrategy } from './twitter-auth.strategy';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [TwitterAuthController,],
  providers: [TwitterAuthService,TwitterStrategy],
})
export class TwitterAuthModule {}

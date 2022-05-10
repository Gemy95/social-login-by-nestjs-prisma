import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';
import { InstagramAuthController } from './instagram-auth.controller';
import { InstagramAuthService } from './instagram-auth.service';
import { InstagramStrategy } from './instagram-auth.strategy';

@Module({
  imports: [JwtAuthModule],
  controllers: [InstagramAuthController],
  providers: [InstagramAuthService,InstagramStrategy]
})
export class InstagramAuthModule {}

import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';
import { AppleAuthController } from './apple-auth.controller';
import { AppleAuthService } from './apple-auth.service';
import { AppleStrategy } from './apple-auth.strategy';

@Module({
  imports: [JwtAuthModule],
  controllers: [AppleAuthController],
  providers: [AppleAuthService,AppleStrategy]
})
export class AppleAuthModule {}

import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookStrategy } from './facebook-auth.strategy';

@Module({
  imports: [JwtAuthModule],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService,FacebookStrategy]
})
export class FacebookAuthModule {}

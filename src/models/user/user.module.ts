import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/auth/jwt-auth/jwt-auth.module';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports:[JwtAuthModule,MailModule],
  controllers: [UserController],
  providers: [UserService,PrismaService,MailService]
})
export class UserModule {}

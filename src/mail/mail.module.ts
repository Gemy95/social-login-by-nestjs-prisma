import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';


@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          //port: configService.get<string>('MAIL_PORT'),
          //ignoreTLS: configService.get<string>('MAIL_IGNORETLS'),
          //secure: configService.get<string>('MAIL_SECURE'),
          auth: {
            user: configService.get<string>('MAIL_FROM'),
            pass: configService.get<string>('MAIL_PASSWORD')
          },
        },
        template: {
          dir: path.join(__dirname,'../../mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService]
    }),
  ],
  providers:[MailService]
})

export class MailModule {}


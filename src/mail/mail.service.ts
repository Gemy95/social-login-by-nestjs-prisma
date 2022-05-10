import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';


@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService,private configService: ConfigService) {}
   
  public sendEmail(mail_to:string,subject:string,template:string,context:Object): void {
    
    this.mailerService
      .sendMail({
        to: mail_to, // list of receivers
        from: this.configService.get<string>("MAIL_FROM"), // sender address
        subject: subject, // Subject line
        template: `${template}.hbs`, // HTML body content
        context: context
      });
    
  }
}
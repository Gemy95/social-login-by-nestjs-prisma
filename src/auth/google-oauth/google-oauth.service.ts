import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { Profile, _json } from 'passport-google-oauth20';

export type Profile = { first_name: string; email: string };

@Injectable()
export class GoogleOauthService {

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
  }

}
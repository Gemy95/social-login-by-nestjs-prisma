import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';
import { GoogleOauthService } from './google-oauth.service';

@ApiTags('Google APIs')
@Controller('google-auth')
export class GoogleOauthController {
  constructor() {}

  @Get('/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req) {
  }

  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
   res.redirect("https://docs.nestjs.com/")
  }
}
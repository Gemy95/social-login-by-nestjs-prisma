import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';


@ApiTags('Facebook APIs')
@Controller('facebook-auth')
export class FacebookAuthController {
  constructor() {}

  @Get("/login")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
    res.redirect("https://docs.nestjs.com/")
  }
}

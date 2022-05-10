import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';


@ApiTags('Apple APIs')
@Controller('apple-auth')
export class AppleAuthController {
    constructor() {}

    @Get("/login")
    @UseGuards(AuthGuard("apple"))
    async appleLogin(): Promise<any> {
      return HttpStatus.OK;
    }
  
    @Get("/redirect")
    @UseGuards(AuthGuard("apple"))
    async appleLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
      res.redirect("https://docs.nestjs.com/")
    }
}

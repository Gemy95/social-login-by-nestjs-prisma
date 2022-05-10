import { Controller, Get, UseGuards, HttpStatus, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Twitter APIs')
@Controller('twitter-auth')
export class TwitterAuthController {
    constructor(){}

    @Get("/login")
    @UseGuards(AuthGuard("twitter"))
    async twitterLogin(): Promise<any> {
      return HttpStatus.OK;
    } 
  
    @Get('/redirect')
    @UseGuards(AuthGuard("twitter"))
    async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
      res.redirect("https://docs.nestjs.com/")
    }
}

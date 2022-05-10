import { Controller, Get, UseGuards, HttpStatus, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Instagram APIs')
@Controller('instagram-auth')
export class InstagramAuthController {
  constructor() {}

  @Get("/login")
  @UseGuards(AuthGuard("instagram"))
  async instagramLogin(): Promise<any> {
    return HttpStatus.OK;
  } 

  @Get('redirect')
  @UseGuards(AuthGuard("instagram"))
  async instagramAuthRedirect(@Req() req: Request, @Res() res: Response) {
    res.redirect("https://docs.nestjs.com/")
  }

}

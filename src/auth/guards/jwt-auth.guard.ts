import {CanActivate,ExecutionContext, HttpException,HttpStatus,Inject,Injectable,UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verify,decode } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const header = request.header('Authorization');
        
    if (!header) {
      throw new HttpException(
        'Authorization: Bearer <token> header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(
        'Authorization: Bearer <token> header invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = parts[1];

    let jwtPayload = decode(token);

    if (!jwtPayload) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    if(jwtPayload['exp'] < Date.now()/1000){
        throw new UnauthorizedException('Expired Token');
    }


    try {
    
      jwtPayload = verify(
        token.toString(),
        this.configService.get<string>('JWT_SECRET')
      );

       if(jwtPayload['user']){
          request['user'] = jwtPayload['user'];
       }else if(jwtPayload['driver']){
          request['driver'] = jwtPayload['driver'];
       }else if(jwtPayload['admin']){
          request['admin'] = jwtPayload['admin'];
       }

       const url= (context.switchToHttp().getResponse().req.url).split('/')[1];
      
       if(url != "admin" && jwtPayload['admin']){
          throw new UnauthorizedException("sorry, you are not an admin");
       }

       if(url != "user" && jwtPayload['user']){
          throw new UnauthorizedException("sorry, you are not a user");
       }

       if(url != "driver" && jwtPayload['driver']){
        throw new UnauthorizedException("sorry, you are not a driver");
       }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}

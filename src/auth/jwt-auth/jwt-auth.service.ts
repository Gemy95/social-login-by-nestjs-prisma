import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign,verify } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma.service';
import { UserParser } from 'src/models/user/user.parse';
import { Providers } from 'src/helpers/providers.helper';
import { Type } from 'src/helpers/type.helper';


@Injectable()
export class JwtAuthService {

  private JWT_SECRET_KEY;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService
  ) {
    this.JWT_SECRET_KEY = configService.get<string>('JWT_SECRET');
  }

  async getUserAccessTokenFromRefresh(refreshToken) {
    try {
      const jwtPayload = verify(refreshToken, this.JWT_SECRET_KEY);
      if (jwtPayload) {
        const user = await this.prismaService.user.findUnique({
          where: { phone: jwtPayload['phone'] },
        });

        delete user.password;
        user['type']= Type.USER;

        let accessToken = sign(
          { user },
          this.JWT_SECRET_KEY,
          { expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') },
        );

        return { accessToken };
        
      } else {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }


  async checkingUserExistsAndGetTokens(userParser:UserParser): Promise<any> {
    try {

        if(userParser.provider == Providers.GOOGLE || userParser.provider == Providers.FACEBOOK){
         await this.prismaService.user.upsert({
         create: userParser,
         update: {...userParser},
         where: { email: userParser.email },
          });
        }
       /*
        if(userParser.provider == Providers.TWITTER){
          await this.prismaService.user.upsert({
            create: userParser,
            update: {...userParser},
            where: { user_name: userParser.user_name },
             });
        }
        */
      userParser['type']= Type.USER;

      const accessToken = sign(
        {
          user:userParser,
        },
          this.JWT_SECRET_KEY,
        {
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      const refreshToken = sign(
        {
          provider: userParser.provider,
          phone: userParser.phone,
          type: Type.USER
        },
        this.JWT_SECRET_KEY,
      );

      return { accessToken,refreshToken } ;

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}
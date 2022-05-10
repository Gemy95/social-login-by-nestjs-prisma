import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtAuthService } from './jwt-auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
@ApiTags('Jwt APIs')
@Controller('jwt-auth')
export class JwtAuthController {

    constructor(private jwtAuthService:JwtAuthService){}

}

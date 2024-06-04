import {
  Controller,
  Dependencies,
  Bind,
  Request,
  Get,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('login')
@Dependencies(ConfigService, JwtService)
export class AuthController {
  constructor(configService, jwtService) {
    this.roles = configService.get('jwt.roles');
    this.jwtService = jwtService;
  }

  @UseGuards(AuthGuard('basic'))
  @Get()
  @Bind(Request())
  login({ user: { username, authorities } }) {
    return this.jwtService.sign({ sub: username, [this.roles]: authorities });
  }
}

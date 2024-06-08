import { Injectable, Dependencies } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Dependencies(ConfigService)
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret')
    });
    this.roles = configService.get('auth.roles');
  }

  validate(payload) {
    return {
      username: payload.sub,
      authorities: payload[this.roles]
    };
  }
}

import { Injectable, Dependencies } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
@Dependencies(Reflector)
export class JwtGuard extends AuthGuard('jwt') {
  constructor(reflector) {
    super();
    this.reflector = reflector;
  }

  async canActivate(context) {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles) {
      return true;
    }
    await super.canActivate(context);
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.authorities.includes(role));
  }
}

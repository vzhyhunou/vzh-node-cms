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
    const req = context.switchToHttp().getRequest();
    req.isUserInRole = (role) =>
      req.user && req.user.authorities.includes(role);
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    try {
      await super.canActivate(context);
      if (!requiredRoles || !requiredRoles.length) {
        return true;
      }
      return requiredRoles.some((role) => req.isUserInRole(role));
    } catch (e) {
      if (!requiredRoles || !requiredRoles.length) {
        return true;
      }
      throw e;
    }
  }
}

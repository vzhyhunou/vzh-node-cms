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
    const request = context.switchToHttp().getRequest();
    request.isUserInRole = (role) =>
      request.user && request.user.authorities.includes(role);
    request.getRemoteUser = () => request.user && request.user.username;
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    try {
      await super.canActivate(context);
      if (!requiredRoles || !requiredRoles.length) {
        return true;
      }
      return requiredRoles.some((role) => request.isUserInRole(role));
    } catch (e) {
      if (
        process.env.NODE_ENV === 'development' ||
        !requiredRoles ||
        !requiredRoles.length
      ) {
        return true;
      }
      throw e;
    }
  }
}

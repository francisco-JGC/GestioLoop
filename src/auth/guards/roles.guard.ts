import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/_shared/constants/user-types.enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.user_role) {
      return false;
    }

    const userRolePriority = user.user_role;

    return requiredRoles.some((role) => userRolePriority >= role);
  }
}

// SUPER_ADMIN (level 4) has access to all routes.
// ADMIN (level 3) can access ADMIN, MANAGER and STAFF routes.
// MANAGER (level 2) can access MANAGER and STAFF routes.
// STAFF (level 1) can only access routes assigned to STAFF.

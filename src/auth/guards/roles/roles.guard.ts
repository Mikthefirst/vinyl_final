import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import {
    JwtPayloadFinal,
    RequestWithJwtUser
} from 'src/auth/interfaces/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        const request = context.switchToHttp().getRequest<RequestWithJwtUser>();
        const user = request.user as JwtPayloadFinal;

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const hasRequiredRoles = requiredRoles.some(
            (role) => user.role === role
        );
        return hasRequiredRoles;
    }
}

/*
@Roles(UserRole.ADMIN)
@UseGuard(RolesGuard)
@UserGuard(JwtGuard)
*/

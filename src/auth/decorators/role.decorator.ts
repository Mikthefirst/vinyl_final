import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [UserRole, ...UserRole[]]) =>
    SetMetadata('roles', roles);

//@Roles(UserRole.ADMIN)

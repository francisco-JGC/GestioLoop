import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/_shared/constants/user-types.enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

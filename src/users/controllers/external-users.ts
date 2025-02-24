import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/_shared/constants/user-types.enums';
import { ExternalUsersService } from '../services/external-user.service';

@ApiTags('external-users')
@Controller('external-users')
export class ExternalUsersController {
  constructor(private readonly externalUsaerService: ExternalUsersService) {}
}

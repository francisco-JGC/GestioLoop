import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TenantService } from '../services/tenant.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/_shared/constants/user-types.enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('configure-tenant')
  async configureTenant(@Req() req) {
    return this.tenantService.configureTenantByUserId(req.user.id, req.body);
  }
}

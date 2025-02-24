import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/_shared/constants/user-types.enums';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('branch')
@Controller('branch')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('configure-branch')
  async configureBranch(@Req() req) {
    return this.branchService.configureBranch(req.user.tenantId, req.body);
  }

  @Get('branches')
  async getBranches(@Req() req) {
    return this.branchService.getBranches(req.user.tenantId);
  }
}

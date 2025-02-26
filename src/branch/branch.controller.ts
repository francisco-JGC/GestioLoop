import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/_shared/constants/user-types.enums';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('configure-branch')
  async configureBranch(@Req() req) {
    return this.branchService.configureBranch(req.user.tenantId, req.body);
  }

  @Roles(UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('branches')
  async getBranches(@Req() req) {
    const { user_type, id } = req.user;

    if (user_type === 'internal')
      return this.branchService.getBranches(req.user.tenantId);

    const branch = await this.branchService.getBranchByExternalUser(id);
    return branch ? [branch] : null;
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-external-user')
  async createExternalUserToBranch(@Req() req) {
    const branchId = req.headers?.['x-branch-id'];
    return this.branchService.createExternalUserToBranch(
      branchId,
      req.user.id,
      req.body,
    );
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update-branch')
  async updateBranch(@Req() req) {
    return this.branchService.updateBranch(req.body);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  async changeStatus(@Param('id') id: string) {
    return this.branchService.changeStatusBranch(id);
  }
}

import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getExternalUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));

    return await this.externalUsaerService.getPaginatedUsers(
      req.user.tenantId,
      pageNumber,
      pageSize,
    );
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  async createUser(@Req() req) {
    return this.externalUsaerService.createUser(req.body);
  }
}

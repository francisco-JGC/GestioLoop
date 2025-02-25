import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/_shared/constants/user-types.enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { ServiceService } from '../services/service.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServices() {
    return this.serviceService.getServices();
  }
}

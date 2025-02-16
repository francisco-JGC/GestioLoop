import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Tenant } from './entities/tenant.entity';
import { TenantService as TenantServiceEntity } from './entities/tenant-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Tenant, TenantServiceEntity])],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}

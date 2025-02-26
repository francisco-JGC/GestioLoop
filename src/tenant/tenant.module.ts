import { forwardRef, Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Tenant } from './entities/tenant.entity';
import { TenantService as TenantServiceEntity } from './entities/tenant-service.entity';
import { CurrencyModule } from 'src/currency/currency.module';
import { UsersModule } from 'src/users/users.module';
import { ServiceService } from './services/service.service';
import { ServiceInitializerService } from './services/service.initializer.service';
import { ServicesController } from './controllers/service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Tenant, TenantServiceEntity]),
    CurrencyModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [TenantController, ServicesController],
  providers: [TenantService, ServiceService, ServiceInitializerService],
  exports: [TenantService],
})
export class TenantModule {}

import { HttpStatus, Injectable } from '@nestjs/common';
import { Service } from '../entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as defaultServiceJSON from '../defaultService.json';
import { TenantService } from './tenant.service';
import { TenantService as TSe } from '../entities/tenant-service.entity';
import { HttpResponse } from 'src/_shared/HttpResponse';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(TSe)
    private readonly tenantServiceRepo: Repository<TSe>,

    private readonly tenantService: TenantService,
    private readonly dataSource: DataSource,
  ) {}

  async createDefaultServices(): Promise<Service[]> {
    const services = defaultServiceJSON.map((service: Service) =>
      this.serviceRepo.create(service),
    );

    for (const service of services) {
      const serviceFound = await this.serviceRepo.findOne({
        where: {
          name: service.name,
        },
      });

      if (!serviceFound) {
        await this.serviceRepo.save(service);
      }
    }

    return services;
  }

  async getServices(): Promise<Service[]> {
    return await this.serviceRepo.find();
  }

  async hireServiceById(
    tenantId: string,
    serviceId: string,
  ): Promise<HttpResponse> {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Service not found',
      };
    }

    const tenant = await this.tenantService.getTenantById(tenantId);

    if (!tenant) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Tenant not found',
      };
    }

    console.log(JSON.stringify(tenant, null, 2));

    const hasService = tenant?.tenant_services.find(
      (service) => service.service.id === serviceId,
    );

    if (hasService) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'You already have this service',
      };
    }

    await this.dataSource.transaction(async (manager) => {
      const tenant_service = this.tenantServiceRepo.create({
        tenant,
        service,
        is_active: true,
      });

      await this.tenantServiceRepo.save(tenant_service);

      tenant.tenant_services.push(tenant_service);
      await manager.save(tenant);
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: service,
    };
  }
}

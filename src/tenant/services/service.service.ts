import { Injectable } from '@nestjs/common';
import { Service } from '../entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as defaultServiceJSON from '../defaultService.json';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
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
}

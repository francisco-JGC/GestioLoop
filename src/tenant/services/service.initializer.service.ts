import { Injectable, OnModuleInit } from '@nestjs/common';
import { ServiceService } from './service.service';

@Injectable()
export class ServiceInitializerService implements OnModuleInit {
  constructor(private readonly serviceService: ServiceService) {}

  async onModuleInit() {
    await this.serviceService.createDefaultServices();
  }
}

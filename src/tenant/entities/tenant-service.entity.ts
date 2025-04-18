import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Service } from './service.entity';

@Entity('tenant_services')
export class TenantService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.tenant_services)
  tenant: Tenant;

  @ManyToOne(() => Service, (service) => service.tenant_services)
  service: Service;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

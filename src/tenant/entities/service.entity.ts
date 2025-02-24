import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TenantService } from './tenant-service.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'jsonb', nullable: false })
  features: Array<{ title: string; items: string[] }>;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => TenantService, (tenantService) => tenantService.service)
  tenant_services: TenantService[];
}

// inventory
// reservation

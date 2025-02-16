import { Currency } from 'src/currency/entities/currency.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TenantService } from './tenant-service.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branch/entities/branch.entity';

@Entity('tenant')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  business_name: string; // business name

  @Column({ unique: true })
  subdomain: string; // Subdominio: tienda1.gestioloop.com

  @OneToMany(() => User, (user) => user.tenant)
  user: User;

  @OneToMany(() => Branch, (branch) => branch.tenant)
  branches: Branch[];

  @ManyToOne(() => Currency, { nullable: true })
  default_currency: Currency;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => TenantService, (tenantService) => tenantService.tenant)
  tenant_services: TenantService[];
}

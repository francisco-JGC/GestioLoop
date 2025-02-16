import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@Entity('currency')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column()
  name: string;

  @Column()
  decimal_places: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Tenant, (tenant) => tenant)
  tenants: Tenant[];
}

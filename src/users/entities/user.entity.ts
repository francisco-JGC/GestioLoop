import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { ExternalUser } from './external-user.entity';
import { UserRole, UserTypes } from '../../_shared/constants/user-types.enums';
import { BaseUser } from './base-user.entity';

@Entity('users')
export class User extends BaseUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;

  @OneToMany(() => ExternalUser, (externalUser) => externalUser.user)
  external_users: ExternalUser[];

  // @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  // auditLogs: AuditLog[];

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SUPER_ADMIN })
  role: UserRole.SUPER_ADMIN;

  @Column({ type: 'enum', enum: UserTypes, default: UserTypes.INTERNAL })
  type: UserTypes.INTERNAL;
}

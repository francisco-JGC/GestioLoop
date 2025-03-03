import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { ExternalUser } from './external-user.entity';
import { UserRole, UserTypes } from '../../_shared/constants/user-types.enums';
import { UserBase } from './user-base.entity';

@Entity('users')
export class User extends UserBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Tenant, (tenant) => tenant.id)
  @JoinColumn()
  tenant: Tenant;

  @OneToMany(() => ExternalUser, (externalUser) => externalUser.user)
  external_users: ExternalUser[];

  // @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  // auditLogs: AuditLog[];

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SUPER_ADMIN })
  user_role: UserRole.SUPER_ADMIN;

  @Column({ type: 'enum', enum: UserTypes, default: UserTypes.INTERNAL })
  user_type: UserTypes.INTERNAL;
}

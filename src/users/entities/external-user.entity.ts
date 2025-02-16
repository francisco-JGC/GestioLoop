import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { UserRole, UserTypes } from '../../_shared/constants/user-types.enums';
import { BaseUser } from './base-user.entity';

@Entity('external_users')
export class ExternalUser extends BaseUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.external_users)
  user: User;

  @ManyToOne(() => Branch, (branch) => branch.id)
  branch: Branch;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  user_role: UserRole.STAFF;

  @Column({
    type: 'enum',
    enum: UserTypes,
    default: UserTypes.EXTERNAL,
  })
  user_type: UserTypes.EXTERNAL;
}

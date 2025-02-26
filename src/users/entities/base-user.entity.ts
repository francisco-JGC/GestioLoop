import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { UserRole, UserTypes } from 'src/_shared/constants/user-types.enums';

export abstract class BaseUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  image_url: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  user_role: UserRole;

  @Column({ type: 'enum', enum: UserTypes })
  user_type: UserTypes;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}

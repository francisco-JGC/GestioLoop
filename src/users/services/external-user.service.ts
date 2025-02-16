import { Injectable } from '@nestjs/common';
import { ExternalUser } from '../entities/external-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@Injectable()
export class ExternalUsersService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepo: Repository<ExternalUser>,
  ) {}

  async findExternalUserByUsername(
    username: string,
  ): Promise<ExternalUser | null> {
    return this.externalUserRepo.findOne({ where: { username } });
  }

  async getTenantByUserId(id: string): Promise<Tenant | null> {
    const user = await this.externalUserRepo.findOne({
      where: { id },
      relations: ['user', 'user.tenant'],
    });

    if (!user) {
      return null;
    }

    return user?.user.tenant;
  }
}

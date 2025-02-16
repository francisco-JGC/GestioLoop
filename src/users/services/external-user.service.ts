import { Injectable } from '@nestjs/common';
import { ExternalUser } from '../entities/external-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExternalUsersService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepository: Repository<ExternalUser>,
  ) {}

  async findExternalUserByUsername(
    username: string,
  ): Promise<ExternalUser | null> {
    return this.externalUserRepository.findOne({ where: { username } });
  }
}

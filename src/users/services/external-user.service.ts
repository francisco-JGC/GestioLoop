import { HttpStatus, Injectable } from '@nestjs/common';
import { ExternalUser } from '../entities/external-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { HttpResponse } from 'src/_shared/HttpResponse';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class ExternalUsersService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepo: Repository<ExternalUser>,
  ) {}

  async findExternalUserByUsername(
    username: string,
  ): Promise<ExternalUser | null> {
    return this.externalUserRepo.findOne({
      where: { username },
      relations: ['branch'],
    });
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

  async createUser(createUserDto: CreateUserDto): Promise<HttpResponse> {
    const userFound = await this.externalUserRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (userFound) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'This user already belongs to a branch',
      };
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 12);
    const user = this.externalUserRepo.create({
      ...createUserDto,
      password_hash,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'External user created',
      data: await this.externalUserRepo.save(user),
    };
  }

  async getBranch(userId: string): Promise<Branch | null> {
    const user = await this.externalUserRepo.findOne({
      where: { id: userId },
      relations: ['branch'],
    });

    return user?.branch ?? null;
  }
}

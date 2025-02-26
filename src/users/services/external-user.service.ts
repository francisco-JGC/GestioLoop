import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ExternalUser } from '../entities/external-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { HttpResponse } from 'src/_shared/HttpResponse';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { TenantService } from 'src/tenant/services/tenant.service';

@Injectable()
export class ExternalUsersService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepo: Repository<ExternalUser>,

    private readonly tenantService: TenantService,
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

  async getPaginatedUsers(
    tenantId: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const tenant = await this.tenantService.getTenantById(tenantId);

    if (!tenant) {
      return {
        message: 'Tenant not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    if (!tenant.user) {
      return {
        message: 'User not found for this tenant',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    const [external_users, total] = await this.externalUserRepo.findAndCount({
      where: { user: { id: tenant.user.id } },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      order: { created_at: 'DESC' },
    });

    return {
      message: 'OK',
      statusCode: HttpStatus.OK,
      data: {
        current_page: pageNumber,
        page_size: pageSize,
        total_users: total,
        total_pages: Math.ceil(total / pageSize),
        external_users,
      },
    };
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { DataSource, Repository } from 'typeorm';
import { TenantService } from 'src/tenant/services/tenant.service';
import { HttpResponse } from 'src/_shared/HttpResponse';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ExternalUsersService } from 'src/users/services/external-user.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,

    private tenantService: TenantService,
    private externalUsersServices: ExternalUsersService,
    private userServices: UsersService,
    private dataSoruce: DataSource,
  ) {}

  async configureBranch(
    tenantId: string,
    createBranchDto: CreateBranchDto,
  ): Promise<HttpResponse> {
    const tenant = await this.tenantService.getTenantById(tenantId);

    if (!tenant) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Tenant not found',
      };
    }

    const existingBranch = tenant.branches.find(
      (branch) => branch.name === createBranchDto.name,
    );

    if (existingBranch) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'There is already a branch with this name',
      };
    }

    const newBranch = this.branchRepo.create(createBranchDto);

    await this.dataSoruce.transaction(async (manager) => {
      await manager.save(newBranch);

      tenant.branches.push(newBranch);

      await manager.save(tenant);
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Branch created',
      data: newBranch,
    };
  }

  async getBranches(tenantId: string): Promise<Branch[] | null> {
    return await this.branchRepo.find({
      relations: ['tenant', 'external_users'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async createExternalUserToBranch(
    branchId: string,
    userId: string,
    createUserDto: CreateUserDto,
  ): Promise<HttpResponse> {
    const branch = await this.branchRepo.findOne({
      where: { id: branchId },
      relations: ['external_users', 'tenant', 'tenant.user'],
    });

    if (!branch) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Branch not found',
      };
    }

    const usernameExist = branch.external_users.find(
      (user) => user.username === createUserDto.username,
    );

    if (usernameExist) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'this username already exists',
      };
    }

    const exmailExist = branch.external_users.find(
      (user) => user.email === createUserDto.email,
    );

    if (exmailExist) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'this email already exists',
      };
    }

    const externalUser =
      await this.externalUsersServices.createUser(createUserDto);

    if (externalUser.statusCode !== HttpStatus.OK) {
      return externalUser;
    }

    branch.external_users.push(externalUser.data);
    await this.branchRepo.save(branch);
    await this.userServices.addExternalUser(userId, externalUser.data);

    return {
      message: 'OK',
      statusCode: HttpStatus.OK,
      data: branch,
    };
  }

  async getBranchByExternalUser(
    externalUserId: string,
  ): Promise<Branch | null> {
    return await this.externalUsersServices.getBranch(externalUserId);
  }
}

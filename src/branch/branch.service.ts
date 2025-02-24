import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { DataSource, Repository } from 'typeorm';
import { TenantService } from 'src/tenant/services/tenant.service';
import { HttpResponse } from 'src/_shared/HttpResponse';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,

    private tenantService: TenantService,
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
      where: { tenant: { id: tenantId } },
      relations: ['tenant', 'external_users'],
      order: {
        created_at: 'DESC',
      },
    });
  }
}

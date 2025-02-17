import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Repository } from 'typeorm';
import { CurrencyService } from 'src/currency/currency.service';
import { ConfigureTenantDto } from '../dto/configure-tenant.dto';
import { HttpResponse } from 'src/_shared/HttpResponse';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,

    private readonly currencyService: CurrencyService,
    private readonly userService: UsersService,
  ) {}

  async configureTenantByUserId(
    userId: string,
    tenantConf: ConfigureTenantDto,
  ): Promise<HttpResponse> {
    const queryRunner = this.tenantRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      if (user.tenant) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'You already have a tenant',
        };
      }

      const tenantFound = await this.tenantRepo.findOne({
        where: { subdomain: tenantConf.subdomain },
      });

      if (tenantFound) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `The subdomain '${tenantConf.subdomain}' is already in use. Please choose a different subdomain.`,
        };
      }

      if (!tenantConf.currencies || tenantConf.currencies.length === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'At least one currency is required',
        };
      }

      const tenant = this.tenantRepo.create({ ...tenantConf, currencies: [] });

      for (const currency of tenantConf.currencies) {
        const savedCurrency =
          await this.currencyService.createCurrency(currency);

        if (savedCurrency.statusCode !== HttpStatus.OK) {
          return {
            statusCode: savedCurrency.statusCode,
            message: 'Error creating currency',
          };
        }

        tenant.currencies.push(savedCurrency.data);
      }

      await queryRunner.manager.save(tenant);
      await this.userService.addTenantToSuperUser(
        user.id,
        tenant,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: 'Created Tenant',
        data: tenant,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating tenant',
      };
    } finally {
      await queryRunner.release();
    }
  }
}

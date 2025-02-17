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
        message:
          'A tenant already exists with this subdomain, change the business name',
      };
    }

    const tenant = this.tenantRepo.create({ ...tenantConf, currencies: [] });

    for (const currency of tenantConf.currencies) {
      const savedCurrency = await this.currencyService.createCurrency(currency);

      if (savedCurrency.statusCode === HttpStatus.OK) {
        tenant.currencies.push(savedCurrency.data);
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Created Tenant',
      data: await this.tenantRepo.save(tenant),
    };
  }
}

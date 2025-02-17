import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Code, Repository } from 'typeorm';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { HttpResponse } from 'src/_shared/HttpResponse';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) {}

  async getCurrencyByCode(code: string): Promise<Currency | null> {
    return await this.currencyRepo.findOne({ where: { code } });
  }

  async createCurrency(currency: CreateCurrencyDto): Promise<HttpResponse> {
    const currencyExist = await this.getCurrencyByCode(currency.code);

    if (!currencyExist) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'you already have a record with this code',
      };
    }

    const createCurrency = this.currencyRepo.create(currency);

    return {
      statusCode: HttpStatus.OK,
      message: 'new currency created',
      data: await this.currencyRepo.save(createCurrency),
    };
  }
}

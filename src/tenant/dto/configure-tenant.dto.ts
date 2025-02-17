import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCurrencyDto } from 'src/currency/dto/create-currency.dto';

export class ConfigureTenantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiProperty()
  @IsObject()
  currencies: CreateCurrencyDto[];
}

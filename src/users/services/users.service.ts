import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpResponse } from 'src/_shared/HttpResponse';
import * as bcrypt from 'bcrypt';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email }, relations: ['tenant'] });
  }

  async registerUser(registerUserDto: CreateUserDto): Promise<HttpResponse> {
    const userFound = await this.userRepo.findOne({
      where: {
        email: registerUserDto.email,
      },
    });

    if (userFound) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists',
        data: null,
      };
    }

    const password_hash = await bcrypt.hash(registerUserDto.password, 12);
    const user = this.userRepo.create({
      ...registerUserDto,
      password_hash,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'user created successfully',
      data: await this.userRepo.save(user),
    };
  }

  async getTenantByUserId(id: string): Promise<Tenant | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!user) {
      return null;
    }

    return user?.tenant;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!user) {
      return null;
    }

    return user;
  }
}

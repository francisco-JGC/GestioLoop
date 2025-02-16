import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpResponse } from 'src/_shared/HttpResponse';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
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
}

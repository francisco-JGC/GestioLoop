import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { ExternalUsersService } from 'src/users/services/external-user.service';
import { ExternalUser } from 'src/users/entities/external-user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpResponse } from 'src/_shared/HttpResponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly externalUserService: ExternalUsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    session_field: string,
    password: string,
  ): Promise<User | ExternalUser | null> {
    const user = await this.userService.findUserByEmail(session_field);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return user;
    }

    const externalUser =
      await this.externalUserService.findExternalUserByUsername(session_field);
    if (
      externalUser &&
      (await bcrypt.compare(password, externalUser.password_hash))
    ) {
      return externalUser;
    }

    return null;
  }

  async login(user: User): Promise<HttpResponse> {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      statusCode: HttpStatus.OK,
      message: 'Welcome to GestioLoop',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }

  async registerUser(registerUserDto: CreateUserDto): Promise<HttpResponse> {
    const user = await this.userService.registerUser(registerUserDto);

    if (user.statusCode !== HttpStatus.OK) {
      return user;
    }

    return await this.login(user.data);
  }
}

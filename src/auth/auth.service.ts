import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { ExternalUsersService } from 'src/users/services/external-user.service';
import { ExternalUser } from 'src/users/entities/external-user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpResponse } from 'src/_shared/HttpResponse';
import { UserTypes } from 'src/_shared/constants/user-types.enums';
import { Tenant } from 'src/tenant/entities/tenant.entity';

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

  async login(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    let tenant: Tenant | null;

    if (user.user_type === UserTypes.INTERNAL) {
      tenant = await this.userService.getTenantByUserId(user.id);
    } else {
      tenant = await this.externalUserService.getTenantByUserId(user.id);
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      user_role: user.user_role,
      user_type: user.user_type,
      tenantId: tenant?.id ?? null,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token,
      refresh_token,
    };
  }

  async registerUser(registerUserDto: CreateUserDto): Promise<HttpResponse> {
    const user = await this.userService.registerUser(registerUserDto);

    if (user.statusCode !== HttpStatus.OK) {
      return user;
    }

    return {
      statusCode: HttpStatus.OK,
      message: '',
      data: {
        user: user.data,
      },
    };
  }

  async refreshToken(
    user: User | ExternalUser,
  ): Promise<{ access_token: string }> {
    let tenant: Tenant | null;

    if (user.user_type === UserTypes.INTERNAL) {
      tenant = await this.userService.getTenantByUserId(user.id);
    } else {
      tenant = await this.externalUserService.getTenantByUserId(user.id);
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      user_role: user.user_role,
      user_type: user.user_type,
      tenantId: tenant?.id ?? null,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    return {
      access_token,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      user_role: payload.user_role,
      user_type: payload.user_type,
      tenantId: payload.tenantId,
    };
  }
}

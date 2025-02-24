import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    const response = await this.authService.login(req.user);

    res.cookie('token', response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(HttpStatus.OK).send({
      message: 'successful login',
      statusCode: HttpStatus.OK,
      data: response.payload,
    });
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.registerUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-session')
  checkSession(@Request() req) {
    return { authenticated: true, user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    res
      .status(HttpStatus.OK)
      .send({ message: 'successful logout', statusCode: HttpStatus.OK });
  }

  @Post('refresh-token')
  async refreshToken(@Request() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: 'No refresh token provided',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const user = this.jwtService.verify(refreshToken);
      const tokens = await this.authService.refreshToken(user);

      res.cookie('token', tokens.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      res.status(HttpStatus.OK).send({
        message: 'Token refreshed',
        statusCode: HttpStatus.OK,
      });
    } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: 'Invalid or expired refresh token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}

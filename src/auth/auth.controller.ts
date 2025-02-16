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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    const response = await this.authService.login(req.user);

    res.cookie('token', response.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    res
      .status(HttpStatus.OK)
      .send({ message: 'successful login', statusCode: HttpStatus.OK });
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
      secure: false,
      sameSite: 'strict',
      expires: new Date(0),
    });

    res
      .status(HttpStatus.OK)
      .send({ message: 'successful logout', statusCode: HttpStatus.OK });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}
}

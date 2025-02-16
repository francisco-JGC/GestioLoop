import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalUser } from './entities/external-user.entity';
import { User } from './entities/user.entity';
import { ExternalUsersService } from './services/external-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ExternalUser])],
  controllers: [UsersController],
  providers: [UsersService, ExternalUsersService],
  exports: [UsersService, ExternalUsersService],
})
export class UsersModule {}

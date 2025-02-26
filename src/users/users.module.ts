import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalUser } from './entities/external-user.entity';
import { User } from './entities/user.entity';
import { ExternalUsersService } from './services/external-user.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExternalUsersController } from './controllers/external-users';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ExternalUser]),
    forwardRef(() => TenantModule),
  ],
  controllers: [UsersController, ExternalUsersController],
  providers: [UsersService, ExternalUsersService, JwtAuthGuard],
  exports: [UsersService, ExternalUsersService],
})
export class UsersModule {}

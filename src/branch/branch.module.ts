import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { TenantModule } from 'src/tenant/tenant.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), TenantModule, UsersModule],
  controllers: [BranchController],
  providers: [BranchService, JwtAuthGuard],
  exports: [BranchService],
})
export class BranchModule {}

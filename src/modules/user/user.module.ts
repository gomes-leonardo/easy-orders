import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './domain/repositories/user-repository';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { HashModule } from '../hash/hash.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, HashModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}

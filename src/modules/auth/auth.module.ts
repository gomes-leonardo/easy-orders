import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/auth.controller';
import { PrismaModule } from '../../prisma.module';
import { HashModule } from '../hash/hash.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './infra/strategies/strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PrismaModule,
    HashModule,
    PassportModule,
    ConfigModule,

    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

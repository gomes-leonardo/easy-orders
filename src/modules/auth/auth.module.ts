import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/auth.controller';
import { PrismaModule } from 'src/prisma.module';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    HashModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

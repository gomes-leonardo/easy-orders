import * as bcrypt from 'bcryptjs';
import { Module } from '@nestjs/common';
import { HashService } from './application/hash.service';

@Module({
  providers: [
    HashService,
    {
      provide: 'BCRYPT_LIB',
      useValue: bcrypt,
    },
  ],
  exports: [HashService],
})
export class HashModule {}

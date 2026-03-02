import { Injectable, Inject } from '@nestjs/common';
import bcrypt from 'bcryptjs/umd/types';

@Injectable()
export class HashService {
  constructor(
    @Inject('BCRYPT_LIB') private readonly bcryptLib: typeof bcrypt,
  ) {}

  async hash(password: string): Promise<string> {
    return this.bcryptLib.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return this.bcryptLib.compare(password, hash);
  }
}

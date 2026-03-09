import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract listAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}

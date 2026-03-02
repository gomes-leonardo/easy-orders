import { PrismaService } from 'src/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user-repository';
import { UserRole } from '../../domain/enums/user-role.enum';
import { Injectable } from '@nestjs/common';

export interface PrismaUser {
  id: string;
  cpf?: string | null;
  email?: string | null;
  password?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  private toEntity(raw: PrismaUser): User {
    return new User({
      id: raw.id,
      cpf: raw.cpf ?? undefined,
      email: raw.email ?? undefined,
      password: raw.password ?? undefined,
      role: raw.role as UserRole,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(user: User): Promise<User> {
    const created = await this.prismaService.user.create({
      data: {
        id: user.id,
        cpf: user.cpf,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return this.toEntity(created);
  }
  async listAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        role: UserRole.CUSTOMER || UserRole.CUSTOMER,
      },
    });

    return users.map((u) => this.toEntity(u));
  }
  async findById(id: string): Promise<User | null> {
    const found = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!found) return null;

    return this.toEntity(found);
  }
  async findByCpf(cpf: string): Promise<User | null> {
    const found = await this.prismaService.user.findUnique({
      where: { cpf },
    });

    if (!found) return null;

    return this.toEntity(found);
  }
  async findByEmail(email: string): Promise<User | null> {
    const found = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!found) return null;
    return this.toEntity(found);
  }
}

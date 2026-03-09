import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repositories/user-repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '../domain/entities/user.entity';
import { UserRole } from '../domain/enums/user-role.enum';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { HashService } from '../../hash/application/hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    let currentRole = UserRole.CUSTOMER;
    if (createUserDto.email) {
      const existingEmail = await this.findByEmail(createUserDto.email);
      if (existingEmail) {
        throw new ConflictException('Email already registered.');
      }
      if (createUserDto.password) {
        const hashed = await this.hashService.hash(createUserDto.password);
        createUserDto.password = hashed;
      }
    }
    if (createUserDto.cpf) {
      const existingCpf = await this.findByCpf(createUserDto.cpf);

      if (existingCpf) {
        throw new ConflictException('CPF already registered.');
      }
    }

    if (!createUserDto.cpf && !createUserDto.email && !createUserDto.password) {
      currentRole = UserRole.GUEST;
    }

    const user = new User({
      ...createUserDto,
      role: currentRole ?? UserRole.CUSTOMER,
    });

    return await this.userRepository.create(user);
  }

  async createAdmin(createAdminDto: CreateAdminDTO): Promise<User> {
    if (createAdminDto.email) {
      const existingEmail = await this.findByEmail(createAdminDto.email);

      if (existingEmail) {
        throw new ConflictException('Email already registered.');
      }
      const hashed = await this.hashService.hash(createAdminDto.password);
      createAdminDto.password = hashed;
    }

    const admin = new User({
      ...createAdminDto,
      role: UserRole.ADMIN,
    });

    return await this.userRepository.create(admin);
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;

    return await this.userRepository.findByEmail(email);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    if (!cpf) return null;

    return await this.userRepository.findByCpf(cpf);
  }

  async findById(id: string): Promise<User | null> {
    if (!id) return null;

    return await this.userRepository.findById(id);
  }

  async findAll(): Promise<User[] | null> {
    return await this.userRepository.listAll();
  }
}

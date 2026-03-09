import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from '../../hash/application/hash.service';
import { UserService } from '../../user/application/user.service';
import { AuthResponseDTO } from './dto/auth-response-dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDTO } from './dto/auth-request-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateByEmail(
    email: string,
    password?: string,
  ): Promise<AuthResponseDTO> {
    const existing = await this.userService.findByEmail(email);

    if (!existing) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    if (!existing.password || !password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValidUser = await this.hashService.compare(
      password,
      existing.password,
    );

    if (!isValidUser) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!existing.id) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const token = this.generateToken({
      id: existing.id,
      email: existing.email,
      role: existing.role,
    });
    return {
      user: {
        id: existing.id,
        role: existing.role,
        message: 'User authenticated successfully',
      },
      token: token,
    };
  }

  async authenticateByCpf(cpf: string): Promise<AuthResponseDTO> {
    const existing = await this.userService.findByCpf(cpf);

    if (!existing) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!existing.id) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = this.generateToken({
      id: existing.id,
      email: existing.email,
      role: existing.role,
    });
    return {
      user: {
        id: existing.id,
        role: existing.role,
        message: 'User authenticated successfully',
      },
      token: token,
    };
  }
  async login(dto: AuthRequestDTO): Promise<AuthResponseDTO> {
    if (dto.cpf) {
      return this.authenticateByCpf(dto.cpf);
    }

    if (dto.email && dto.password) {
      return this.authenticateByEmail(dto.email, dto.password);
    }

    throw new BadRequestException('Email/password or CPF must be provided.');
  }
  logout() {
    return { message: 'You have been successfully logged out.' };
  }

  generateToken(user: { id: string; email?: string; role: string }): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { HashService } from '../../hash/application/hash.service';
import { UserService } from '../../user/application/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  const mockUserService = {
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
  };

  const mockHashService = {
    compare: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: HashService, useValue: mockHashService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  it('should validate user credentials with email and password and return JWT sucessfully.', async () => {
    const email = 'teste@email.com';
    const password = 'Mudar@123';
    const hashedPassword = 'hashed_password_123';
    mockJwtService.sign.mockReturnValue('mock-jwt-token');

    mockUserService.findByEmail.mockResolvedValue({
      id: '1',
      email,
      password: hashedPassword,
    });

    mockHashService.compare.mockResolvedValue(true);

    const result = await service.authenticateByEmail(email, password);

    expect(result).toBeDefined();
    expect(result.token).toBe('mock-jwt-token');
    expect(mockHashService.compare).toHaveBeenCalledWith(
      password,
      hashedPassword,
    );
  });
  it('should validate user with CPF and return JWT sucessfully.', async () => {
    const cpf = '047.550.850-55';
    mockUserService.findByCpf.mockResolvedValue({
      cpf,
    });

    mockJwtService.sign.mockReturnValue('mock-jwt-token');

    const result = await service.authenticateByCpf(cpf);

    expect(result).toBeDefined();
    expect(result.token).toBe('mock-jwt-token');
  });
  it('should throw UnauthorizedException when user email is not found', async () => {
    const email = 'inexistente@email.com';
    const password = 'qualquer_senha';

    mockUserService.findByEmail.mockResolvedValue(null);

    await expect(service.authenticateByEmail(email, password)).rejects.toThrow(
      new UnauthorizedException('Invalid credentials.'),
    );

    expect(mockHashService.compare).not.toHaveBeenCalled();
  });
});

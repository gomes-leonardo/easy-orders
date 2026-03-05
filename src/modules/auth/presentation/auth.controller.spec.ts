/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/auth.service';
import { AuthRequestDTO } from '../application/dto/auth-request-dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should login successfully using CPF', async () => {
    const loginDto: AuthRequestDTO = { cpf: '305.000.480-02' };
    const mockResponse = {
      id: '1',
      role: 'CUSTOMER',
      token: 'jwt-via-cpf',
      message: 'User authenticated successfully',
    };

    mockAuthService.login.mockResolvedValue(mockResponse);

    const result = await controller.login(loginDto);

    expect(result).toEqual(mockResponse);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });

  describe('login', () => {
    it('should call authService.login with correct credentials', async () => {
      const loginDto = {
        email: 'teste@email.com',
        password: 'Mudar@123',
      };

      const expectedResponse = {
        id: 'user-123',
        role: 'CUSTOMER',
        token: 'mock-jwt-token',
        message: 'User authenticated successfully',
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});

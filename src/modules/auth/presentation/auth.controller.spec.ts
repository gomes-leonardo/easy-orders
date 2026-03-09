/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/auth.service';
import { AuthRequestDTO } from '../application/dto/auth-request-dto';
import { AuthController } from './auth.controller';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockRes = {
    cookie: jest.fn(),
  } as unknown as Response;

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
  });

  it('should login successfully using CPF', async () => {
    const loginDto: AuthRequestDTO = { cpf: '305.000.480-02' };

    mockAuthService.login.mockResolvedValue({
      user: {
        id: '1',
        role: 'CUSTOMER',
        message: 'User authenticated successfully',
      },
      token: 'mock-token',
    });

    const result = await controller.login(loginDto, mockRes);

    expect(result).toEqual({
      id: '1',
      role: 'CUSTOMER',
      message: 'User authenticated successfully',
    });
    expect(mockRes.cookie).toHaveBeenCalledWith(
      'access_token',
      'mock-token',
      expect.any(Object),
    );
  });

  describe('login', () => {
    it('should call authService.login with correct credentials', async () => {
      const loginDto = {
        email: 'teste@email.com',
        password: 'Mudar@123',
      };

      mockAuthService.login.mockResolvedValue({
        user: {
          id: 'user-123',
          role: 'CUSTOMER',
          message: 'User authenticated successfully',
        },
        token: 'mock-jwt-token',
      });

      const result = await controller.login(loginDto, mockRes);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        id: 'user-123',
        role: 'CUSTOMER',
        message: 'User authenticated successfully',
      });
    });
  });
});

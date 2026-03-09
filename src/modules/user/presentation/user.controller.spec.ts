/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/user.service';
import { UserRole } from '../domain/enums/user-role.enum';
import { UserController } from './user.controller';
import { AuthService } from '../../auth/application/auth.service';
import { Response } from 'express';

describe('User Controller', () => {
  let service: UserService;
  let controller: UserController;

  const mockAuthService = {
    generateToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            createAdmin: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('Create Guest - Should create user and set auth cookie', async () => {
    const dto = {
      email: undefined,
      cpf: undefined,
      password: undefined,
    };

    const mockUserEntity = {
      id: 'user-123',
      ...dto,
      role: UserRole.GUEST,
    };

    const mockRes = {
      cookie: jest.fn(),
    } as unknown as Response;

    (service.create as jest.Mock).mockResolvedValue(mockUserEntity);
    mockAuthService.generateToken.mockReturnValue('mock-jwt-token');

    const response = await controller.create(dto, mockRes);

    expect(response.id).toBe('user-123');
    expect(response.role).toEqual(UserRole.GUEST);
    expect(response).not.toHaveProperty('password');
    expect(mockAuthService.generateToken).toHaveBeenCalledWith({
      id: 'user-123',
      email: undefined,
      role: UserRole.GUEST,
    });
    expect(mockRes.cookie).toHaveBeenCalledWith(
      'access_token',
      'mock-jwt-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
      }),
    );
  });

  it('Create Customer with CPF - Should create user and set auth cookie', async () => {
    const dto = {
      cpf: '981.111.100-65',
    };

    const mockUserEntity = {
      id: 'user-123',
      ...dto,
      role: UserRole.CUSTOMER,
    };

    const mockRes = {
      cookie: jest.fn(),
    } as unknown as Response;

    (service.create as jest.Mock).mockResolvedValue(mockUserEntity);
    mockAuthService.generateToken.mockReturnValue('mock-jwt-token');

    const response = await controller.create(dto, mockRes);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(response.role).toEqual(UserRole.CUSTOMER);
    expect(mockRes.cookie).toHaveBeenCalledWith(
      'access_token',
      'mock-jwt-token',
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('Create Admin - Should call service.createAdmin and NOT set cookie', async () => {
    const dto = {
      email: 'admin@email.com',
      password: 'Mudar@123',
    };

    const mockAdminEntity = {
      id: 'user-123',
      ...dto,
      role: UserRole.ADMIN,
    };

    (service.createAdmin as jest.Mock).mockResolvedValue(mockAdminEntity);

    const response = await controller.createAdmin(dto);

    expect(response).toEqual({
      id: 'user-123',
      email: 'admin@email.com',
      role: UserRole.ADMIN,
    });
    expect(service.createAdmin).toHaveBeenCalledWith(dto);
    expect(response).not.toHaveProperty('password');
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });

  it('List Guests/Customers - Should call service.listAll and return all users', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'guest@email.com',
        role: UserRole.GUEST,
      },
      {
        id: 'user-2',
        email: 'customer@email.com',
        role: UserRole.CUSTOMER,
      },
    ];

    (service.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const response = await controller.listAll();

    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockUsers);

    response.forEach((user) => {
      expect(user).not.toHaveProperty('password');
    });
  });
});

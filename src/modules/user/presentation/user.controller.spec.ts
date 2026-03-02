/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/user.service';
import { UserRole } from '../domain/enums/user-role.enum';
import { UserController } from './user.controller';

describe('User Controller', () => {
  let service: UserService;
  let controller: UserController;

  beforeEach(async () => {
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
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('Create Guest - User: Should call service.create with correct dto', async () => {
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

    (service.create as jest.Mock).mockResolvedValue(mockUserEntity);

    const response = await controller.create(dto);

    expect(response.id).toBe('user-123');
    expect(response.role).toEqual(UserRole.GUEST);
    expect(response).not.toHaveProperty('password');
  });
  it('Create Customer with CPF - User: Should call service.create with correct dto', async () => {
    const dto = {
      cpf: '981.111.100-65',
    };

    const expectedResult = {
      id: 'user-123',
      ...dto,
      role: UserRole.CUSTOMER,
    };

    (service.create as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.create(dto);

    expect(response).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(response.role).toEqual(UserRole.CUSTOMER);
  });
  it('Create Admin - Should call service.createAdmin and return user with ADMIN role', async () => {
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
  });

  it('List Guests/Customers - Should call service.listAll and return all Guests or Customers.', async () => {
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

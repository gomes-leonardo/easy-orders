import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../domain/entities/user.entity';
import { UserRole } from '../domain/enums/user-role.enum';
import { UserRepository } from '../domain/repositories/user-repository';
import { UserService } from './user.service';
import { HashService } from '../../hash/application/hash.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
    listAll: jest.fn(),
    delete: jest.fn(),
  };

  const mockHashService = {
    hash: jest.fn().mockResolvedValue('Mudar@123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: HashService, useValue: mockHashService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a Customer with cpf successfully and call repository', async () => {
      const validCpf = '873.278.710-39';
      const dto = { cpf: validCpf };

      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation((u: User) => u);

      await service.create(dto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
    });

    it('should create a Customer with unmasked cpf successfully and call repository', async () => {
      const validCpf = '87327871039';
      const dto = { cpf: validCpf };

      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation((u: User) => u);

      await service.create(dto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
    });

    it('should create a Guest without cpf, email and password sucessfully', async () => {
      const dto = {
        cpf: undefined,
        email: undefined,
        password: undefined,
      };

      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation((u: User) => u);

      const result = await service.create(dto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
      expect(result.role).toEqual(UserRole.GUEST);
    });

    it('should throw ConflictException if CPF already exists', async () => {
      const existingCpf = '873.278.710-39';
      const dto = { cpf: existingCpf };

      mockUserRepository.findByCpf.mockResolvedValue(
        new User({ cpf: existingCpf, role: UserRole.CUSTOMER }),
      );

      await expect(service.create(dto)).rejects.toThrow(
        'CPF already registered',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should create a Customer with email and password successfully', async () => {
      const dto = { email: 'newuser@email.com', password: 'Mudar@123' };

      const hashedFake = 'Hash@Fake123';
      mockHashService.hash.mockResolvedValue(hashedFake);

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation((u: User) => u);

      await service.create(dto);

      expect(mockHashService.hash).toHaveBeenCalledWith('Mudar@123');

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedFake,
          role: UserRole.CUSTOMER,
        }),
      );
    });

    it('should throw ConflictException if Email already exists', async () => {
      const dto = { email: 'existing@email.com', password: 'Mudar@123' };

      mockUserRepository.findByEmail.mockResolvedValue(
        new User({
          email: 'existing@email.com',
          password: 'Mudar@123',
          role: UserRole.CUSTOMER,
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(
        'Email already registered',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if Email Admin already exists', async () => {
      const dto = { email: 'existing@email.com', password: 'Mudar@123' };

      mockUserRepository.findByEmail.mockResolvedValue(
        new User({
          email: 'existing@email.com',
          password: 'Mudar@123',
          role: UserRole.ADMIN,
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(
        'Email already registered',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should create Admin successfully with hashed password', async () => {
      const dto = {
        email: 'admin2@admin.com',
        password: 'senha-em-texto-puro',
      };

      const hashedFake = 'Hash_gerado_pelo_mock_123@';
      mockHashService.hash.mockResolvedValue(hashedFake);

      mockUserRepository.create.mockImplementation((u: User) => u);

      const result = await service.createAdmin(dto);

      expect(mockHashService.hash).toHaveBeenCalledWith('senha-em-texto-puro');

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedFake,
          role: UserRole.ADMIN,
        }),
      );

      expect(result.password).toBe(hashedFake);
    });

    it('should return a list of customers or guests.', async () => {
      const mockUsers = [
        new User({
          email: 'cliente@email.com',
          password: 'Mudar@123',
          role: UserRole.CUSTOMER,
        }),
        new User({
          email: 'cliente2@email.com',
          password: 'Mudar@123',
          role: UserRole.CUSTOMER,
        }),
      ];

      mockUserRepository.listAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockUserRepository.listAll).toHaveBeenCalled();

      expect(result?.length).toEqual(2);
    });
  });
});

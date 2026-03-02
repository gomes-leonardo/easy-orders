import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;

  const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        {
          provide: 'BCRYPT_LIB',
          useValue: mockBcrypt,
        },
      ],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a hashed string', async () => {
    const password = 'Mudar@123';
    const fakeHash = '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890';

    mockBcrypt.hash.mockResolvedValue(fakeHash);

    const result = await service.hash(password);

    expect(result).toBe(fakeHash);
    expect(result).not.toBe(password);
    expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
  });
});

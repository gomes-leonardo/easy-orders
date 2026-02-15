import { randomUUID } from 'crypto';
import { ProductCategory } from './enums/product-category.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './product.service';
import { ProductsRepository } from './repositories/products-repository';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

const makeProduct = (overrides?: Partial<Product>) =>
  new Product({
    id: randomUUID(),
    name: 'Batata Frita M',
    price: 1500,
    category: ProductCategory.SIDEDISH,
    isAvailable: true,
    isDeleted: false,
    ...overrides,
  });

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductsRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    listAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product and call repository', async () => {
      const dto = {
        name: 'Maple',
        price: 2900,
        category: ProductCategory.BURGER,
        isAvailable: true,
      };

      mockProductsRepository.create.mockImplementation((p) => p);

      const result = await service.create(dto);

      expect(result.name).toBe('Maple');
      expect(result.price).toBe(2900);
      expect(mockProductsRepository.create).toHaveBeenCalledWith(
        expect.any(Product),
      );
    });

    it('should throw DomainError when price is <= 0', async () => {
      const dto = {
        name: 'Invalido',
        price: -10,
        isAvailable: true,
        category: ProductCategory.BURGER,
      };

      await expect(service.create(dto)).rejects.toThrow(
        'Price must be greater than 0',
      );
      expect(mockProductsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw DomainError when name is empty', async () => {
      const dto = {
        name: '',
        price: 1000,
        isAvailable: true,
        category: ProductCategory.BURGER,
      };

      await expect(service.create(dto)).rejects.toThrow(
        'Product name is required',
      );
      expect(mockProductsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('listAll', () => {
    it('should return all products', async () => {
      const products = [makeProduct(), makeProduct({ name: 'Oak', price: 3590 })];
      mockProductsRepository.listAll.mockResolvedValue(products);

      const result = await service.listAll();

      expect(result).toEqual(products);
      expect(mockProductsRepository.listAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const product = makeProduct();
      mockProductsRepository.findById.mockResolvedValue(product);

      const result = await service.findById(product.id!);

      expect(result).toEqual(product);
      expect(mockProductsRepository.findById).toHaveBeenCalledWith(product.id);
    });
  });

  describe('update', () => {
    it('should update product fields and preserve unchanged ones', async () => {
      const existing = makeProduct({ name: 'Batata Frita M', price: 1500 });
      mockProductsRepository.findById.mockResolvedValue(existing);
      mockProductsRepository.update.mockImplementation((p) => p);

      const result = await service.update(existing.id!, {
        name: 'Batata Frita G',
        price: 2200,
      });

      expect(result.name).toBe('Batata Frita G');
      expect(result.price).toBe(2200);
      expect(result.category).toBe(existing.category);
      expect(result.isAvailable).toBe(existing.isAvailable);
      expect(mockProductsRepository.update).toHaveBeenCalledWith(
        expect.any(Product),
      );
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockProductsRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(randomUUID(), { name: 'NotFound' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const product = makeProduct();
      mockProductsRepository.findById.mockResolvedValue(product);
      mockProductsRepository.delete.mockResolvedValue(undefined);

      await service.delete(product.id!);

      expect(mockProductsRepository.findById).toHaveBeenCalledWith(product.id);
      expect(mockProductsRepository.delete).toHaveBeenCalledWith(product.id);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockProductsRepository.findById.mockResolvedValue(null);

      await expect(service.delete(randomUUID())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

import { randomUUID } from 'crypto';

import { ProductCategory } from './enums/product-category.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './product.service';
import { ProductsRepository } from './repositories/products-repository';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

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
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should create a new product using repository', async () => {
    const dto = {
      id: randomUUID(),
      name: 'Batata Frita Grande',
      price: 15.99,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    };

    const repositoryResponse = {
      ...dto,
      id: randomUUID(),
      name: dto.name,
      createdAt: new Date(),
    };

    mockProductsRepository.create.mockResolvedValue(repositoryResponse);

    const result = await service.create(dto);

    expect(result).toEqual(repositoryResponse);
    expect(mockProductsRepository.create).toHaveBeenCalledWith(
      expect.any(Product),
    );
  });
  it('Should throw an error if price is less than 0', async () => {
    const dto = {
      id: randomUUID(),
      name: 'Batata Frita P',
      price: -10,
      isAvailable: true,
      category: ProductCategory.BURGER,
    };

    await expect(service.create(dto)).rejects.toThrow(
      'Price must be greater than 0',
    );
    expect(mockProductsRepository.create).toHaveBeenCalledTimes(0);
  });

  it('Should throw an error if name is empty', async () => {
    const dto = {
      id: randomUUID(),
      name: '',
      price: 10,
      isAvailable: true,
      category: ProductCategory.BURGER,
    };

    const repositoryResponse = {
      ...dto,
      id: randomUUID(),
      name: dto.name,
      createdAt: new Date(),
    };

    mockProductsRepository.create.mockResolvedValue(repositoryResponse);
    await expect(service.create(dto)).rejects.toThrow(
      'Product name is required',
    );
    expect(mockProductsRepository.create).toHaveBeenCalledTimes(0);
  });

  it('should return all products using repository', async () => {
    const repositoryResponse = [
      {
        id: randomUUID(),
        name: 'Batata Frita M',
        price: 15.99,
        category: ProductCategory.SIDEDISH,
        isAvailable: Boolean,
      },
    ];

    mockProductsRepository.listAll.mockResolvedValue(repositoryResponse);

    const result = await service.listAll();

    expect(mockProductsRepository.listAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(repositoryResponse);
  });
  it('should return products by id using repository', async () => {
    const id = randomUUID();

    const existingProduct = new Product({
      id,
      name: 'Batata Frita M',
      price: 15.99,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
      createdAt: new Date(),
    });
    const repositoryResponse = [
      {
        ...existingProduct,
      },
    ];

    mockProductsRepository.findById.mockResolvedValue(repositoryResponse);
    const result = await service.findById(id);

    expect(mockProductsRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(repositoryResponse);
  });

  it('should update product price and product name', async () => {
    const id = randomUUID();

    const existingProduct = new Product({
      id,
      name: 'Batata Frita M',
      price: 15.99,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
      createdAt: new Date(),
    });

    const updatedProduct = new Product({
      id: id,
      name: 'Batata Frita G',
      price: 20.99,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    });

    mockProductsRepository.findById.mockResolvedValue(existingProduct);
    mockProductsRepository.update.mockResolvedValue(updatedProduct);

    const result = await service.update(id, {
      id: id,
      name: 'Batata Frita G',
      price: 20.99,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    });

    expect(mockProductsRepository.findById).toHaveBeenCalledWith(
      existingProduct.id,
    );
    expect(mockProductsRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: existingProduct.id,
        name: 'Batata Frita G',
        price: 20.99,
        category: ProductCategory.SIDEDISH,
        isAvailable: true,
      }),
    );
    expect(result.price).toBe(20.99);
    expect(result.name).toBe('Batata Frita G');
    expect(mockProductsRepository.update).toHaveBeenCalledWith(
      expect.any(Product),
    );
  });

  it('should throw NotFoundException when product does not exist', async () => {
    mockProductsRepository.findById.mockResolvedValue(null);

    await expect(
      service.update(randomUUID(), {
        id: randomUUID(),
        price: 5,
        name: 'NotFound',
        category: ProductCategory.DRINK,
        isAvailable: true,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete product', async () => {
    const id = randomUUID();

    const existingProduct = new Product({
      id,
      name: 'Batata Frita M',
      price: 15.99,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
      createdAt: new Date(),
    });

    mockProductsRepository.findById.mockResolvedValue(existingProduct);
    mockProductsRepository.delete.mockResolvedValue(id);

    await service.delete(id);

    expect(mockProductsRepository.findById).toHaveBeenCalledWith(id);
    expect(mockProductsRepository.delete).toHaveBeenCalledWith(id);
  });
});

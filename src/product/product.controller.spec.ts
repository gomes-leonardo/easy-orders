/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { ProductCategory } from './enums/product-category.enum';
import { randomUUID } from 'crypto';

describe('Products Controller', () => {
  let service: ProductsService;
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            listAll: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<ProductsService>(ProductsService);
    controller = module.get<ProductsController>(ProductsController);
  });

  it('Create - PRODUCT: Should call service.create with correct dto', async () => {
    const dto = {
      name: 'Smash Cheddar',
      price: 39.99,
      category: ProductCategory.BURGER,
      isAvailable: true,
    };
    const expectedResult = { id: randomUUID(), ...dto };

    (service.create as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.create(dto);

    expect(response).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('Update - Products: Should call service.update with id and dto', async () => {
    const id = randomUUID();
    const dto = {
      price: 45.0,
      name: 'Maple',
      category: ProductCategory.BURGER,
      isAvailable: true,
    };
    const expectedResult = { id, dto };

    (service.update as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.update(id, dto);

    expect(response).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('Delete - Products: Should call service.delete with correct id', async () => {
    const id = randomUUID();
    (service.delete as jest.Mock).mockResolvedValue({ id });

    const response = await controller.delete(id);

    expect(response).toEqual({ id });
    expect(service.delete).toHaveBeenCalledWith(id);
  });

  it('List All - Products: Should return an array of available products', async () => {
    const expectedResult = [
      { id: '1', name: 'Refri', isDeleted: false },
      { id: '2', name: 'Burger', isDeleted: false },
    ];

    (service.listAll as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.listAll();

    expect(response).toEqual(expectedResult);
    expect(Array.isArray(response)).toBe(true);
    expect(response[0].isDeleted).toBe(false);
  });
});

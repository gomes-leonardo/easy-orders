/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './product.service';
import { ProductCategory } from './enums/product-category.enum';
import { randomUUID } from 'crypto';
import { ProductsController } from './product.controller';

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
  it('Create - PRODUCT: Should create a new product.', () => {
    const id = randomUUID();
    const price = 39.99;
    const category = ProductCategory.BURGER;
    const isAvailable = true;
    const name = 'Smash Cheddar Burger';

    const dto = { id, price, category, isAvailable, name };

    const expectedResult = {
      id,
      price,
      category,
      isAvailable,
      name,
    };
    (service.create as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.create(dto);

    expect(response).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
  it('Update - Products: Should update product quantity.', () => {
    const id = randomUUID();
    const price = 39.99;
    const category = ProductCategory.BURGER;
    const isAvailable = true;
    const name = 'Smash Cheddar Burger';

    const dto = { id, price, category, isAvailable, name };

    const expectedResult = {
      id,
      price,
      category,
      isAvailable,
      name,
    };
    (service.update as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.update(id, dto);

    expect(response).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });
  it('Delete - Products: Should delete product sucessfuly.', () => {
    const id = randomUUID();

    const expectedResult = {
      id: id,
    };

    (service.delete as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.delete(id);

    expect(response).toEqual(expectedResult);
    expect(service.delete).toHaveBeenCalledWith(id);
  });

  it('List All - Products: Should return all products.', () => {
    const id = randomUUID();
    const price = 39.99;
    const category = ProductCategory.BURGER;
    const isAvailable = true;
    const name = 'Smash Cheddar Burger';

    const expectedResult = {
      id,
      price,
      category,
      isAvailable,
      name,
    };
    (service.listAll as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.listAll();

    expect(response).toEqual(expectedResult);
  });
});

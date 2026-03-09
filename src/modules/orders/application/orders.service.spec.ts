/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRepository } from '../domain/repositories/order-repository';
import { ProductsRepository } from '../../product/domain/repositories/product-repository';
import { OrderStatus } from '../domain/enums/order-status.enum';
import { Order } from '../domain/entities/order.entity';

describe('OrdersService', () => {
  let service: OrdersService;

  const userId = 'user-123';

  const mockOrdersRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    listAll: jest.fn(),
    delete: jest.fn(),
  };

  const mockProductsRepository = {
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrderRepository, useValue: mockOrdersRepository },
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.resetAllMocks();
  });

  it('should create an order successfully with userId from JWT', async () => {
    mockProductsRepository.findById.mockResolvedValue({
      name: 'Maple',
      price: 1500,
      isDeleted: false,
    });

    mockOrdersRepository.create.mockImplementation((order) => order);

    const result = await service.create(
      { items: [{ productId: 'p1', quantity: 2 }] },
      userId,
    );

    expect(result.total).toBe(3000);
    expect(result.userId).toBe(userId);
    expect(mockOrdersRepository.create).toHaveBeenCalledWith(expect.any(Order));
  });

  it('should throw if product is deleted during creation', async () => {
    mockProductsRepository.findById.mockResolvedValue({
      name: 'Old Product',
      isDeleted: true,
    });

    await expect(
      service.create({ items: [{ productId: 'p1', quantity: 1 }] }, userId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if product does not exist', async () => {
    mockProductsRepository.findById.mockResolvedValue(null);

    await expect(
      service.create({ items: [{ productId: 'p1', quantity: 1 }] }, userId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update order items and fetch new prices', async () => {
    const existing = {
      id: 'o1',
      userId,
      status: OrderStatus.OPEN,
      items: [],
    };
    mockOrdersRepository.findById.mockResolvedValue(existing);

    mockProductsRepository.findById
      .mockResolvedValueOnce({ price: 10, isDeleted: false })
      .mockResolvedValueOnce({ price: 20, isDeleted: false });

    mockOrdersRepository.update.mockImplementation((order) => order);

    const result = await service.update(
      'o1',
      {
        items: [
          { productId: 'p1', quantity: 1 },
          { productId: 'p2', quantity: 1 },
        ],
      },
      userId,
    );

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(30);
  });

  it('should throw ForbiddenException if user tries to update another users order', async () => {
    mockOrdersRepository.findById.mockResolvedValue({
      id: 'o1',
      userId: 'other-user',
      status: OrderStatus.OPEN,
      items: [{ productId: 'p1', quantity: 1, price: 10 }],
    });

    await expect(
      service.update('o1', {}, userId),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow update without checking isDeleted if items are not changed', async () => {
    const existing = {
      id: 'o1',
      userId,
      status: OrderStatus.OPEN,
      items: [{ productId: 'old', price: 50, quantity: 1 }],
    };
    mockOrdersRepository.findById.mockResolvedValue(existing);

    mockProductsRepository.findById.mockResolvedValue({
      isDeleted: true,
      price: 50,
    });
    mockOrdersRepository.update.mockImplementation((order) => order);

    const result = await service.update(
      'o1',
      { status: OrderStatus.PENDING },
      userId,
    );

    expect(result.items[0].productId).toBe('old');
    expect(mockOrdersRepository.update).toHaveBeenCalled();
  });

  it('should throw Unauthorized if order status is not allowed for update', async () => {
    mockOrdersRepository.findById.mockResolvedValue({
      userId,
      status: OrderStatus.DONE,
    });

    await expect(service.update('o1', {}, userId)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should delete an existing order', async () => {
    mockOrdersRepository.findById.mockResolvedValue({ id: 'o1', userId });
    mockOrdersRepository.delete.mockResolvedValue(undefined);

    await service.delete('o1', userId);

    expect(mockOrdersRepository.findById).toHaveBeenCalledWith('o1');
    expect(mockOrdersRepository.delete).toHaveBeenCalledWith('o1');
  });

  it('should throw ForbiddenException when deleting another users order', async () => {
    mockOrdersRepository.findById.mockResolvedValue({
      id: 'o1',
      userId: 'other-user',
    });

    await expect(service.delete('o1', userId)).rejects.toThrow(
      ForbiddenException,
    );
    expect(mockOrdersRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when deleting non-existent order', async () => {
    mockOrdersRepository.findById.mockResolvedValue(null);

    await expect(service.delete('o1', userId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockOrdersRepository.delete).not.toHaveBeenCalled();
  });
});

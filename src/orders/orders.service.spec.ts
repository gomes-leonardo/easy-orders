import { randomUUID } from 'crypto';
import { OrderStatus } from './enums/order-status.enum';
import { OrdersService } from './orders.service';
import { TestingModule, Test } from '@nestjs/testing';
import { OrdersRepository } from './repositories/orders.repository';
import { Order } from './entities/orders.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProductsRepository } from '../product/repositories/products-repository';

describe('OrdersService', () => {
  let service: OrdersService;

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
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    mockProductsRepository.findById.mockResolvedValue({
      name: 'Maple',
      price: 1500,
      isDeleted: false,
    });
    mockOrdersRepository.create.mockImplementation((order) => ({
      id: '123',
      ...order,
    }));

    const result = await service.create({
      items: [{ productId: 'p1', quantity: 2 }],
    });

    expect(result.total).toBe(3000);
    expect(mockOrdersRepository.create).toHaveBeenCalledWith(expect.any(Order));
  });
  it('should throw if product is deleted during creation', async () => {
    mockProductsRepository.findById.mockResolvedValue({ isDeleted: true });

    await expect(
      service.create({ items: [{ productId: 'p1', quantity: 1 }] }),
    ).rejects.toThrow(NotFoundException);
  });
  it('should update order items and fetch new prices', async () => {
    const existing = { id: 'o1', status: OrderStatus.OPEN, items: [] };
    mockOrdersRepository.findById.mockResolvedValue(existing);

    mockProductsRepository.findById
      .mockResolvedValueOnce({ price: 10, isDeleted: false })
      .mockResolvedValueOnce({ price: 20, isDeleted: false });

    mockOrdersRepository.update.mockImplementation((order) => order);

    const result = await service.update('o1', {
      items: [
        { productId: 'p1', quantity: 1 },
        { productId: 'p2', quantity: 1 },
      ],
    });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(30);
  });

  it('should allow update without checking isDeleted if items are not changed', async () => {
    const existing = {
      id: 'o1',
      status: OrderStatus.OPEN,
      items: [{ productId: 'old', price: 50, quantity: 1 }],
    };
    mockOrdersRepository.findById.mockResolvedValue(existing);

    // Produto está DELETADO no catálogo, mas não mudamos os itens no DTO
    mockProductsRepository.findById.mockResolvedValue({
      isDeleted: true,
      price: 50,
    });
    mockOrdersRepository.update.mockImplementation((order) => order);

    const result = await service.update('o1', { status: OrderStatus.PENDING });

    expect(result.items[0].productId).toBe('old');
    expect(mockOrdersRepository.update).toHaveBeenCalled();
  });

  it('should throw Unauthorized if order status is not allowed for update', async () => {
    mockOrdersRepository.findById.mockResolvedValue({
      status: OrderStatus.DONE,
    });

    await expect(service.update('o1', {})).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

import { randomUUID } from 'crypto';
import { OrderStatus } from './enums/order-status.enum';
import { OrdersService } from './orders.service';
import { TestingModule, Test } from '@nestjs/testing';
import { OrdersRepository } from './repositories/orders.repository';
import { Order } from './entities/orders.entity';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrdersRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    listAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should create a new order using repository', async () => {
    const dto = {
      productId: randomUUID(),
      quantity: 4,
      status: OrderStatus.OPEN,
    };

    const repositoryResponse = {
      id: randomUUID(),
      ...dto,
      createdAt: new Date(),
    };

    mockOrdersRepository.create.mockResolvedValue(repositoryResponse);

    const result = await service.create(dto);

    expect(mockOrdersRepository.create).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(repositoryResponse);
  });
  it('should return all orders using repository', async () => {
    const repositoryResponse = [
      {
        productId: randomUUID(),
        quantity: 4,
        status: OrderStatus.OPEN,
      },
    ];

    mockOrdersRepository.listAll.mockResolvedValue(repositoryResponse);

    const result = await service.listAll();

    expect(mockOrdersRepository.listAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(repositoryResponse);
  });
  it('should return orders by id using repository', async () => {
    const orderId = randomUUID();

    const existingOrder = new Order({
      id: orderId,
      productId: randomUUID(),
      quantity: 2,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const repositoryResponse = [
      {
        id: existingOrder.id,
        productId: existingOrder.productId,
        quantity: existingOrder.quantity,
        createdAt: existingOrder.createdAt,
        updatedAt: existingOrder.updatedAt,
      },
    ];

    mockOrdersRepository.findById.mockResolvedValue(repositoryResponse);
    const result = await service.findById(orderId);

    expect(mockOrdersRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(repositoryResponse);
  });

  it('should update order quantity and preserve status', async () => {
    const orderId = randomUUID();

    const existingOrder = new Order({
      id: orderId,
      productId: randomUUID(),
      quantity: 2,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedOrder = new Order({
      id: orderId,
      productId: existingOrder.productId,
      quantity: 10,
      status: OrderStatus.PENDING,
    });

    mockOrdersRepository.findById.mockResolvedValue(existingOrder);
    mockOrdersRepository.update.mockResolvedValue(updatedOrder);

    const result = await service.update(orderId, { quantity: 10 });

    expect(mockOrdersRepository.findById).toHaveBeenCalledWith(orderId);
    expect(mockOrdersRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: orderId,
        quantity: 10,
        productId: existingOrder.productId,
        status: OrderStatus.PENDING,
      }),
    );
    expect(result.quantity).toBe(10);
    expect(result.status).toBe(OrderStatus.PENDING);
  });

  it('should throw NotFoundException when order does not exist', async () => {
    mockOrdersRepository.findById.mockResolvedValue(null);

    await expect(service.update(randomUUID(), { quantity: 5 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete order', async () => {
    const orderId = randomUUID();

    const existingOrder = new Order({
      id: orderId,
      productId: randomUUID(),
      quantity: 2,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockOrdersRepository.findById.mockResolvedValue(existingOrder);
    mockOrdersRepository.delete.mockResolvedValue(orderId);

    await service.delete(orderId);

    expect(mockOrdersRepository.findById).toHaveBeenCalledWith(orderId);
    expect(mockOrdersRepository.delete).toHaveBeenCalledWith(orderId);
  });
});

/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { randomUUID } from 'crypto';
import { OrderStatus } from './enums/order-status.enum';

describe('Orders Controller', () => {
  let service: OrdersService;
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            listAll: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<OrdersService>(OrdersService);
    controller = module.get<OrdersController>(OrdersController);
  });

  it('Create - ORDERS: Should call service.create with correct dto', async () => {
    const dto = {
      items: [{ productId: randomUUID(), quantity: 2 }],
      status: OrderStatus.OPEN,
    };
    const expectedResult = { id: 'order-123', ...dto };

    (service.create as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.create(dto);

    expect(response).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('Update - ORDERS: Should call service.update with id from URL and dto from body', async () => {
    const orderId = randomUUID();
    const dto = {
      items: [{ productId: randomUUID(), quantity: 5 }],
    };
    const expectedResult = { id: orderId, status: OrderStatus.OPEN };

    (service.update as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.update(orderId, dto);

    expect(response).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(orderId, dto);
  });

  it('Delete - ORDERS: Should call service.delete with correct id', async () => {
    const orderId = randomUUID();
    (service.delete as jest.Mock).mockResolvedValue({ deleted: true });

    const response = await controller.delete(orderId);

    expect(response).toEqual({ deleted: true });
    expect(service.delete).toHaveBeenCalledWith(orderId);
  });

  it('List All - ORDERS: Should return an array of orders', async () => {
    const expectedResult = [
      { id: '1', status: OrderStatus.OPEN, items: [] },
      { id: '2', status: OrderStatus.PENDING, items: [] },
    ];

    (service.listAll as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.listAll();

    expect(response).toEqual(expectedResult);
    expect(Array.isArray(response)).toBe(true);
    expect(service.listAll).toHaveBeenCalled();
  });
});

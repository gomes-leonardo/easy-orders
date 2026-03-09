/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { randomUUID } from 'crypto';
import { OrdersService } from '../application/orders.service';
import { OrderStatus } from '../domain/enums/order-status.enum';
import { AuthenticatedRequest } from '../../auth/infra/interfaces/authenticated-request';

describe('Orders Controller', () => {
  let service: OrdersService;
  let controller: OrdersController;

  const mockReq = {
    user: { userId: 'user-123', email: 'test@test.com', role: 'CUSTOMER' },
  } as unknown as AuthenticatedRequest;

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
            findById: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<OrdersService>(OrdersService);
    controller = module.get<OrdersController>(OrdersController);
  });

  it('Create - ORDERS: Should call service.create with dto and userId from JWT', async () => {
    const dto = {
      items: [{ productId: randomUUID(), quantity: 2 }],
      status: OrderStatus.OPEN,
    };
    const expectedResult = { id: 'order-123', ...dto };

    (service.create as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.create(dto, mockReq);

    expect(response).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(dto, 'user-123');
  });

  it('Update - ORDERS: Should call service.update with id, dto and userId', async () => {
    const orderId = randomUUID();
    const dto = {
      items: [{ productId: randomUUID(), quantity: 5 }],
    };
    const expectedResult = { id: orderId, status: OrderStatus.OPEN };

    (service.update as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.update(orderId, dto, mockReq);

    expect(response).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(orderId, dto, 'user-123');
  });

  it('Delete - ORDERS: Should call service.delete with id and userId', async () => {
    const orderId = randomUUID();
    (service.delete as jest.Mock).mockResolvedValue(undefined);

    await controller.delete(orderId, mockReq);

    expect(service.delete).toHaveBeenCalledWith(orderId, 'user-123');
  });

  it('GetById - ORDERS: Should call service.findById with id and userId', async () => {
    const orderId = randomUUID();
    const expectedResult = { id: orderId, status: OrderStatus.OPEN, items: [] };

    (service.findById as jest.Mock).mockResolvedValue(expectedResult);

    const response = await controller.getById(orderId, mockReq);

    expect(response).toEqual(expectedResult);
    expect(service.findById).toHaveBeenCalledWith(orderId, 'user-123');
  });

  it('List All - ORDERS: Should return an array of orders (admin only)', async () => {
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

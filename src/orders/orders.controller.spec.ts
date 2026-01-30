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
  it('Create - ORDERS: Should create a new order.', () => {
    const productId = randomUUID();
    const quantity = 4;
    const status = OrderStatus.OPEN;

    const dto = { productId, quantity, status };

    const expectedResult = {
      productId,
      quantity,
      status: OrderStatus.OPEN,
    };
    (service.create as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.create(dto);

    expect(response).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
  it('Update - ORDERS: Should update order quantity.', () => {
    const orderId = randomUUID();
    const dto = { quantity: 10 };

    const expectedResult = {
      id: orderId,
      productId: randomUUID(),
      quantity: 10,
      status: OrderStatus.OPEN,
    };

    (service.update as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.update(orderId, dto);

    expect(response).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(orderId, dto);
  });
  it('Delete - ORDERS: Should delete order sucessfuly.', () => {
    const orderId = randomUUID();

    const expectedResult = {
      id: orderId,
    };

    (service.delete as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.delete(orderId);

    expect(response).toEqual(expectedResult);
    expect(service.delete).toHaveBeenCalledWith(orderId);
  });

  it('List All - ORDERS: Should return all orders.', () => {
    const productId = randomUUID();
    const quantity = 4;

    const expectedResult = {
      productId,
      quantity,
      status: OrderStatus.OPEN,
    };
    (service.listAll as jest.Mock).mockReturnValue(expectedResult);

    const response = controller.listAll();

    expect(response).toEqual(expectedResult);
  });
});

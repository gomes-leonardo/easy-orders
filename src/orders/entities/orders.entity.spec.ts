import { randomUUID } from 'node:crypto';
import { Order } from './orders.entity';
import { OrderStatus } from '../enums/order-status.enum';

describe('Order Entity', () => {
  it('Order entity must return status', () => {
    const productId = randomUUID();
    const quantity = 2;
    const status = OrderStatus.OPEN;

    const order = new Order({
      productId,
      quantity,
      status,
    });
    expect(order.productId).toEqual(productId);
    expect(order.quantity).toEqual(quantity);
    expect(order.status).toEqual(OrderStatus.OPEN);
  });

  it('Should throw an error if quantity is less than or equal to 0', () => {
    const productId = randomUUID();
    const quantity = -5;
    const status = OrderStatus.OPEN;

    expect(() => {
      new Order({ quantity: quantity, productId, status });
    }).toThrow('Quantity must be greater than 0');
  });
});

import { randomUUID } from 'node:crypto';
import { Order } from './orders.entity';
import { OrderStatus } from '../enums/order-status.enum';

describe('Order Entity', () => {
  it('should create a valid order with multiple items and calculate total correctly', () => {
    const id = randomUUID();
    const items = [
      { productId: randomUUID(), quantity: 2, price: 15.5 }, // 31.00
      { productId: randomUUID(), quantity: 1, price: 10.0 }, // 10.00
    ];

    const order = new Order({
      id,
      items,
      status: OrderStatus.OPEN,
    });

    expect(order.id).toBe(id);
    expect(order.items).toHaveLength(2);
    expect(order.status).toBe(OrderStatus.OPEN);
    expect(order.total).toBe(41.0); // 31 + 10
  });

  it('should throw an error if order has no items', () => {
    expect(() => {
      new Order({ items: [], status: OrderStatus.OPEN });
    }).toThrow('Order must have at least one item');
  });

  it('should throw an error if any item has quantity <= 0', () => {
    const items = [{ productId: '1', quantity: 0, price: 10 }];

    expect(() => {
      new Order({ items });
    }).toThrow('Quantity for product must be greater than 0');
  });

  it('should throw an error if any item has negative price', () => {
    const items = [{ productId: '1', quantity: 1, price: -5 }];

    expect(() => {
      new Order({ items });
    }).toThrow('Price for product cannot be negative');
  });

  it('should default status to OPEN if not provided', () => {
    const order = new Order({
      items: [{ productId: '1', quantity: 1, price: 10 }],
    });
    expect(order.status).toBe(OrderStatus.OPEN);
  });
});

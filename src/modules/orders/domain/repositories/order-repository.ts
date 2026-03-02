import { Order } from '../entities/order.entity';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<Order>;
  abstract findById(id: string): Promise<Order | null>;
  abstract update(order: Order): Promise<Order>;
  abstract listAll(): Promise<Order[]>;
  abstract delete(id: string): Promise<void>;
}

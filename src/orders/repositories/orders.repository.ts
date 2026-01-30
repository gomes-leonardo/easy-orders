import { Order } from '../entities/orders.entity';

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<Order>;
  abstract findById(id: string): Promise<Order | null>;
  abstract update(order: Order): Promise<Order>;
  abstract listAll(): Promise<Order[]>;
  abstract delete(id: string): Promise<void>;
}

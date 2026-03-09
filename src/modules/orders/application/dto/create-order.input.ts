import { OrderStatus } from '../../domain/enums/order-status.enum';

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  status?: OrderStatus;
}

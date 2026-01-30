import { OrderStatus } from '../enums/order-status.enum';

interface OrderProps {
  id?: string;
  quantity: number;
  productId: string;
  status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  id?: string;
  quantity: number;
  productId: string;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.quantity = props.quantity;
    this.productId = props.productId;
    this.status = props.status ?? OrderStatus.OPEN;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }
}

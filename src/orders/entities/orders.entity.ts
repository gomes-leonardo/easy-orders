import { DomainError } from '../../common/errors/domain.error';
import { OrderStatus } from '../enums/order-status.enum';

export interface OrderItemProps {
  productId: string;
  quantity: number;
  price: number;
}
interface OrderProps {
  id?: string;
  status?: OrderStatus;
  items: OrderItemProps[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id?: string;
  public readonly items: OrderItemProps[];
  public readonly status: OrderStatus;
  public readonly total: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: OrderProps) {
    if (!props.items || props.items.length === 0) {
      throw new DomainError('Order must have at least one item');
    }

    this.id = props.id;
    this.status = props.status ?? OrderStatus.OPEN;
    this.items = props.items;
    this.total = this.calculateTotal();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    props.items.forEach((item) => {
      if (item.quantity <= 0) {
        throw new DomainError(`Quantity for product must be greater than 0`);
      }

      if (item.price < 0) {
        throw new DomainError(`Price for product cannot be negative`);
      }
    });

    if (this.total < 0) {
      throw new DomainError('Total must be greater than 0');
    }
  }
  private calculateTotal(): number {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }
}

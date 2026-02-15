import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDTO, CreateOrderItemDTO } from './dto/create.order.dto';
import { UpdateOrderDTO } from './dto/update.order.dto';
import { Order, OrderItemProps } from './entities/orders.entity';
import { OrdersRepository } from './repositories/orders.repository';
import { OrderStatus } from './enums/order-status.enum';
import { ProductsRepository } from '../product/repositories/products-repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  private async mapItemsWithPrices(
    dtoItems: CreateOrderItemDTO[],
    checkIsDeleted = true,
  ): Promise<OrderItemProps[]> {
    const items = await Promise.all(
      dtoItems.map(async (item) => {
        const product = await this.productsRepository.findById(item.productId);
        if (!product)
          throw new NotFoundException(`Product ${item.productId} not found`);
        if (checkIsDeleted && product.isDeleted) {
          throw new NotFoundException(
            `Product ${product.name} is no longer available`,
          );
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    return items;
  }
  async create(dto: CreateOrderDTO): Promise<Order> {
    const items = await this.mapItemsWithPrices(dto.items, true);

    const order = new Order({ items, status: dto.status ?? OrderStatus.OPEN });
    return this.ordersRepository.create(order);
  }

  async update(id: string, dto: UpdateOrderDTO): Promise<Order> {
    const existing = await this.ordersRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    const allowedStatuses = [OrderStatus.OPEN, OrderStatus.PENDING];

    if (!allowedStatuses.includes(existing.status)) {
      throw new UnauthorizedException(
        `Orders with status ${existing.status} cannot be updated.`,
      );
    }

    const items = await this.mapItemsWithPrices(
      dto.items ? dto.items : existing.items,
      dto.items ? true : false,
    );

    const updated = new Order({
      id,
      items,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
    });

    return this.ordersRepository.update(updated);
  }

  async listAll(): Promise<Order[]> {
    return this.ordersRepository.listAll();
  }

  async findById(id: string): Promise<Order | null> {
    return this.ordersRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await this.ordersRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.ordersRepository.delete(id);
  }
}

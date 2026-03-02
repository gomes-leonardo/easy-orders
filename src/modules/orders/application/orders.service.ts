import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderRepository } from '../domain/repositories/order-repository';
import { Order, OrderItemProps } from '../domain/entities/order.entity';
import { OrderStatus } from '../domain/enums/order-status.enum';
import { ProductsRepository } from '../../product/domain/repositories/product-repository';
import {
  CreateOrderDTO,
  CreateOrderItemDTO,
} from '../presentation/dto/create-order.dto';
import { UpdateOrderDTO } from '../presentation/dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  private async mapItemsWithPrices(
    dtoItems: CreateOrderItemDTO[],
    checkIsDeleted = true,
  ): Promise<OrderItemProps[]> {
    return Promise.all(
      dtoItems.map(async (item) => {
        const product = await this.productsRepository.findById(item.productId);
        if (!product)
          throw new NotFoundException(`Product ${item.productId} not found`);
        if (checkIsDeleted && product.isDeleted)
          throw new NotFoundException(
            `Product ${product.name} is no longer available`,
          );
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );
  }

  async create(dto: CreateOrderDTO): Promise<Order> {
    const items = await this.mapItemsWithPrices(dto.items, true);
    const order = new Order({
      items,
      userId: dto.userId,
      status: dto.status ?? OrderStatus.OPEN,
    });
    return this.ordersRepository.create(order);
  }

  async update(id: string, dto: UpdateOrderDTO): Promise<Order> {
    const existing = await this.ordersRepository.findById(id);

    if (!existing) throw new NotFoundException(`Order ${id} not found`);

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
      userId: existing.userId,
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

  async delete(id: string): Promise<void> {
    const existing = await this.ordersRepository.findById(id);

    if (!existing) throw new NotFoundException(`Order ${id} not found`);

    return this.ordersRepository.delete(id);
  }
}

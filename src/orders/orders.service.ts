import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create.order.dto';
import { UpdateOrderDTO } from './dto/update.order.dto';
import { Order } from './entities/orders.entity';
import { OrdersRepository } from './repositories/orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(createOrderDto: CreateOrderDTO): Promise<Order> {
    const order = new Order(createOrderDto);
    return this.ordersRepository.create(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDTO): Promise<Order> {
    const existing = await this.ordersRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    const updated = new Order({
      id: existing.id,
      quantity: updateOrderDto.quantity ?? existing.quantity,
      productId: updateOrderDto.productId ?? existing.productId,
      status: existing.status,
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

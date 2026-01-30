import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrdersRepository } from './orders.repository';
import { Order } from '../entities/orders.entity';
import { OrderStatus } from '../enums/order-status.enum';

interface PrismaOrder {
  id: string;
  productId: string;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  private toEntity(raw: PrismaOrder): Order {
    return new Order({
      id: raw.id,
      quantity: raw.quantity,
      productId: raw.productId,
      status: raw.status as OrderStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(order: Order): Promise<Order> {
    const created = await this.prismaService.order.create({
      data: {
        quantity: order.quantity,
        productId: order.productId,
        status: order.status,
      },
    });

    return this.toEntity(created);
  }

  async listAll(): Promise<Order[]> {
    const orders = await this.prismaService.order.findMany();
    return orders.map((o) => this.toEntity(o));
  }

  async findById(id: string): Promise<Order | null> {
    const found = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!found) return null;

    return this.toEntity(found);
  }

  async update(order: Order): Promise<Order> {
    const updated = await this.prismaService.order.update({
      where: { id: order.id },
      data: {
        quantity: order.quantity,
        productId: order.productId,
        status: order.status,
      },
    });

    return this.toEntity(updated);
  }

  async delete(id: string) {
    await this.prismaService.order.delete({
      where: {
        id,
      },
    });
  }
}

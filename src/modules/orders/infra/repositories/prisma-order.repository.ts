import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order-repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import {
  OrderStatus as PrismaOrderStatus,
  OrderItem,
} from 'generated/prisma/client';
import { PrismaService } from '../../../../prisma.service';

interface PrismaOrder {
  id: string;
  userId: string;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private toEntity(raw: PrismaOrder): Order {
    return new Order({
      id: raw.id,
      userId: raw.userId,
      status: raw.status as OrderStatus,
      items: raw.items,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(order: Order): Promise<Order> {
    const created = await this.prismaService.order.create({
      data: {
        id: order.id,
        status: order.status as PrismaOrderStatus,
        userId: order.userId,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        updatedAt: order.updatedAt,
        createdAt: order.createdAt,
      },
      include: { items: true },
    });

    return this.toEntity(created);
  }

  async listAll(): Promise<Order[]> {
    const orders = await this.prismaService.order.findMany({
      include: { items: true },
    });
    return orders.map((o) => this.toEntity(o));
  }

  async findById(id: string): Promise<Order | null> {
    const found = await this.prismaService.order.findFirst({
      where: { id },
      include: { items: true },
    });

    if (!found) return null;

    return this.toEntity(found);
  }

  async update(order: Order): Promise<Order> {
    const updated = await this.prismaService.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: order.id } });

      return tx.order.update({
        where: { id: order.id },
        data: {
          status: order.status as PrismaOrderStatus,
          items: {
            create: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });
    });

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.order.delete({ where: { id } });
  }
}

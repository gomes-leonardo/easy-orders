import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { OrdersRepository } from './orders.repository';
import { Order } from '../entities/orders.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderStatus as PrismaOrderStatus } from 'generated/prisma/client';
import { OrderItem } from 'generated/prisma/client';

interface PrismaOrder {
  id: string;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  private toEntity(raw: PrismaOrder): Order {
    return new Order({
      id: raw.id,
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
      include: {
        items: true,
      },
    });

    return this.toEntity(created);
  }

  async listAll(): Promise<Order[]> {
    const orders = await this.prismaService.order.findMany({
      include: {
        items: true,
      },
    });
    return orders.map((o) => this.toEntity(o));
  }

  async findById(id: string): Promise<Order | null> {
    const found = await this.prismaService.order.findFirst({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!found) return null;

    return this.toEntity(found);
  }

  async update(order: Order): Promise<Order> {
    const updated = await this.prismaService.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: order.id },
      });

      return await tx.order.update({
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
        include: {
          items: true,
        },
      });
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

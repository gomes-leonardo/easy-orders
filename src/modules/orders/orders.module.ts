import { Module } from '@nestjs/common';
import { OrdersController } from './presentation/orders.controller';
import { OrderRepository } from './domain/repositories/order-repository';
import { PrismaOrderRepository } from './infra/repositories/prisma-order.repository';

import { PrismaModule } from '../../prisma.module';
import { ProductModule } from '../product/product.module';
import { OrdersService } from './application/orders.service';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [OrdersModule, ProductModule],
})
export class AppModule {}

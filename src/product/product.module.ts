import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { ProductsRepository } from './repositories/products-repository';
import { PrismaProductsRepository } from './repositories/prisma-products.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [ProductsRepository],
})
export class ProductModule {}

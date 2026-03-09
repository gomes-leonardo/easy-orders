import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { ProductsController } from './presentation/product.controller';
import { ProductsService } from './application/product.service';
import { ProductsRepository } from './domain/repositories/product-repository';
import { PrismaProductsRepository } from './infra/repositories/prisma-product.repository';

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

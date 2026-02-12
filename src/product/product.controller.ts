import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDTO } from './dto/create.product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDTO } from './dto/update.product.dto';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() product: CreateProductDTO) {
    return this.productsService.create(product);
  }

  @Get()
  listAll(): Promise<Product[]> {
    return this.productsService.listAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() product: UpdateProductDTO) {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../application/product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '../domain/entities/product.entity';
import { UpdateProductDTO } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/infra/guards/roles.guard';
import { Roles } from '../../auth/infra/decorators/roles.decorator';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(@Body() product: CreateProductDTO) {
    return this.productsService.create(product);
  }

  @Get()
  listAll(): Promise<Product[]> {
    return this.productsService.listAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() product: UpdateProductDTO) {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}

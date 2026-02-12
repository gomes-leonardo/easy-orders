import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './repositories/products-repository';
import { CreateProductDTO } from './dto/create.product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDTO } from './dto/update.product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDTO): Promise<Product> {
    const product = new Product(createProductDto);
    return await this.productsRepository.create(product);
  }

  async listAll(): Promise<Product[]> {
    return await this.productsRepository.listAll();
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productsRepository.findById(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    const existing = await this.productsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    const updatedProduct = new Product({
      id: existing.id,
      name: updateProductDto.name ?? existing.name,
      category: updateProductDto.category ?? existing.category,
      price: updateProductDto.price ?? existing.price,
      isAvailable: updateProductDto.isAvailable ?? existing.isAvailable,
    });
    return await this.productsRepository.update(updatedProduct);
  }

  async delete(id: string) {
    const existing = await this.productsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return await this.productsRepository.delete(id);
  }
}

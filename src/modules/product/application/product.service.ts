import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../domain/repositories/product-repository';
import { CreateProductDTO } from '../presentation/dto/create-product.dto';
import { Product } from '../domain/entities/product.entity';
import { UpdateProductDTO } from '../presentation/dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDTO): Promise<Product> {
    const product = new Product({
      ...createProductDto,
      isDeleted: false,
    });
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
      isDeleted: existing.isDeleted,
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

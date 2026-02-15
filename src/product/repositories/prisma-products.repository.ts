import { Product } from '../entities/product.entity';
import { ProductsRepository } from './products-repository';
import { ProductCategory } from '../enums/product-category.enum';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

interface PrismaProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private toEntity(raw: PrismaProduct): Product {
    return new Product({
      id: raw.id,
      price: raw.price,
      name: raw.name,
      category: raw.category as ProductCategory,
      isAvailable: raw.isAvailable,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isDeleted: raw.isDeleted ?? false,
    });
  }

  async create(product: Product): Promise<Product> {
    const created: PrismaProduct = await this.prismaService.product.create({
      data: {
        name: product.name,
        price: product.price,
        category: product.category,
        isAvailable: product.isAvailable,
      },
    });

    return this.toEntity(created);
  }
  async findById(id: string): Promise<Product | null> {
    const found = await this.prismaService.product.findFirst({
      where: { id, isDeleted: false },
    });

    if (!found) return null;

    return this.toEntity(found);
  }
  async update(product: Product): Promise<Product> {
    const updatedProduct = await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        category: product.category,
        price: product.price,
        isAvailable: product.isAvailable,
      },
    });

    return this.toEntity(updatedProduct);
  }
  async listAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany({
      where: { isDeleted: false },
    });
    return products.map((p) => this.toEntity(p));
  }
  async delete(id: string): Promise<void> {
    await this.prismaService.product.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}

import { DomainError } from '../../common/errors/domain.error';
import { ProductCategory } from '../enums/product-category.enum';

interface ProductProps {
  id?: string;
  name: string;
  category: ProductCategory;
  price: number;
  isAvailable: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  id?: string;
  name: string;
  price: number;
  isAvailable: boolean;
  category: ProductCategory;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this.category = props.category;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.isAvailable = props.isAvailable;
    this.isDeleted = props.isDeleted ?? false;

    if (this.price <= 0) {
      throw new DomainError('Price must be greater than 0');
    }
    if (!this.name) {
      throw new DomainError('Product name is required');
    }
  }
}

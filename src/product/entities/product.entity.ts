import { ProductCategory } from '../enums/product-category.enum';

interface ProductProps {
  id?: string;
  name: string;
  category: ProductCategory;
  price: number;
  isAvailable: boolean;
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

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this.category = props.category;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.isAvailable = props.isAvailable;

    if (this.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    if (!this.name) {
      throw new Error('Product name is required');
    }
  }
}

import { randomUUID } from 'node:crypto';
import { ProductCategory } from '../enums/product-category.enum';
import { Product } from './product.entity';

describe('Product Entity', () => {
  it('Product entity must return successfully with default values', () => {
    const id = randomUUID();
    const props = {
      id,
      name: 'Cheddar',
      category: ProductCategory.BURGER,
      price: 39.55,
      isAvailable: true,
    };

    const product = new Product(props);

    expect(product.id).toEqual(id);
    expect(product.isDeleted).toBe(false);
    expect(product.category).toEqual(ProductCategory.BURGER);
  });

  it('Should correctly set isDeleted if provided', () => {
    const product = new Product({
      name: 'Old Burger',
      price: 10,
      category: ProductCategory.BURGER,
      isAvailable: false,
      isDeleted: true,
    });
    expect(product.isDeleted).toBe(true);
  });

  it('Should throw an error if price is less than 0', () => {
    expect(() => {
      new Product({
        name: 'Burger',
        price: -10,
        category: ProductCategory.BURGER,
        isAvailable: true,
      });
    }).toThrow('Price must be greater than 0');
  });

  it('Should throw an error if name is empty', () => {
    expect(() => {
      new Product({
        name: '',
        price: 10,
        category: ProductCategory.BURGER,
        isAvailable: true,
      });
    }).toThrow('Product name is required');
  });
});

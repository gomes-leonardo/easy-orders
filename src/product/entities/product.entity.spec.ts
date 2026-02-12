import { randomUUID } from 'node:crypto';
import { ProductCategory } from '../enums/product-category.enum';
import { Product } from './product.entity';

describe('Product Entity', () => {
  it('Product entity must return sucessfully', () => {
    const id = randomUUID();
    const name = 'Cheddar';
    const category = ProductCategory.BURGER;
    const price = 39.55;

    const product = new Product({
      id,
      name,
      isAvailable: true,
      category,
      price,
    });
    expect(product.id).toEqual(id);
    expect(product.name).toEqual(name);
    expect(product.price).toEqual(price);
    expect(product.category).toEqual(ProductCategory.BURGER);
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

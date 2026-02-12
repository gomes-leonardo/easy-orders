import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ProductCategory } from '../src/product/enums/product-category.enum';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const products = [
    {
      name: 'Maple',
      price: 2900,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Maple',
      price: 2900,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Maple',
      price: 2900,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Maple',
      price: 2900,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Oak',
      price: 3590,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Teak',
      price: 3390,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Kaury',
      price: 2900,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Trunk',
      price: 4590,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Lumber',
      price: 3890,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },
    {
      name: 'Willow',
      price: 3990,
      category: ProductCategory.BURGER,
      isAvailable: true,
    },

    {
      name: 'Batata Frita P',
      price: 1390,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    },
    {
      name: 'Batata Frita M',
      price: 1790,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    },
    {
      name: 'Batata Frita G',
      price: 2290,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    },
    {
      name: 'Nugget G',
      price: 2590,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    },
    {
      name: 'Nugget P',
      price: 2090,
      category: ProductCategory.SIDEDISH,
      isAvailable: true,
    },
    {
      name: 'Refrigerante',
      price: 800,
      category: ProductCategory.DRINK,
      isAvailable: true,
    },
    {
      name: 'Refrigerante Zero',
      price: 800,
      category: ProductCategory.DRINK,
      isAvailable: true,
    },
    {
      name: 'Brownie',
      price: 1200,
      category: ProductCategory.DESSERT,
      isAvailable: true,
    },
    {
      name: 'Sorvete Banuilha',
      price: 300,
      category: ProductCategory.DESSERT,
      isAvailable: true,
    },
    {
      name: 'Sorvete Chocolate',
      price: 300,
      category: ProductCategory.DESSERT,
      isAvailable: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

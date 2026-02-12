import {
  IsUUID,
  IsInt,
  Min,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../enums/product-category.enum';

export class CreateProductDTO {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'X-Burger Bacon',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Preço do produto em centavos',
    example: 2500,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  price: number;

  @ApiProperty({
    description: 'Produto disponível para venda',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Categoria do produto',
    enum: ProductCategory,
    example: ProductCategory.BURGER,
  })
  @IsEnum(ProductCategory)
  category: ProductCategory;
}

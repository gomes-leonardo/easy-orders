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

export class UpdateProductDTO {
  @ApiProperty({
    description: 'ID do produto a ser atualizado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'X-Burger Bacon Deluxe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Preço do produto em centavos',
    example: 2800,
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

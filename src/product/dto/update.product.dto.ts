import {
  IsInt,
  Min,
  IsEnum,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../enums/product-category.enum';

export class UpdateProductDTO {
  @ApiProperty({ description: 'Product name', example: 'Maple Burger', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Price in cents', example: 2900, minimum: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  price?: number;

  @ApiProperty({ description: 'Whether the product is available', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ description: 'Product category', enum: ProductCategory, example: ProductCategory.BURGER, required: false })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;
}

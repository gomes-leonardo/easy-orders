import {
  IsUUID,
  IsInt,
  Min,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderItemDTO {
  @ApiProperty({ example: 'f82093f7-e2e4-4231-b84c-c12889056fcd' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDTO {
  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [CreateOrderItemDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  @ArrayMinSize(1)
  items: CreateOrderItemDTO[];

  @ApiProperty({ enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

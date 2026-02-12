import { IsUUID, IsInt, Min, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDTO {
  @ApiProperty({
    description: 'ID do produto a ser pedido',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Status do pedido',
    enum: OrderStatus,
    example: OrderStatus.OPEN,
    required: false,
  })
  @ValidateIf((o: CreateOrderDTO) => o.status !== undefined)
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

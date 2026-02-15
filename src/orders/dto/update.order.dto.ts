import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';
import { CreateOrderItemDTO } from './create.order.dto';

export class UpdateOrderDTO {
  @ApiProperty({
    description: 'Nova lista completa de itens do pedido (Snapshot)',
    type: [CreateOrderItemDTO],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items?: CreateOrderItemDTO[];

  @ApiProperty({
    description: 'Alterar o status do pedido',
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

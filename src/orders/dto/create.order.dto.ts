import { IsUUID, IsInt, Min, IsEnum, ValidateIf } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDTO {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @ValidateIf((o: CreateOrderDTO) => o.status !== undefined)
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

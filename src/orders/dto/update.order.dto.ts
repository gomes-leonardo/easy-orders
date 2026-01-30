import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateOrderDTO {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

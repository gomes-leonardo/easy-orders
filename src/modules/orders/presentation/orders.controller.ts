import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

import { Order } from '../domain/entities/order.entity';
import { OrdersService } from '../application/orders.service';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDTO): Promise<Order> {
    return this.ordersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDTO): Promise<Order> {
    return this.ordersService.update(id, dto);
  }

  @Get()
  listAll(): Promise<Order[]> {
    return this.ordersService.listAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.ordersService.delete(id);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Order | null> {
    return this.ordersService.findById(id);
  }
}

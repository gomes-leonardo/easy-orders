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
import { CreateOrderDTO } from './dto/create.order.dto';
import { UpdateOrderDTO } from './dto/update.order.dto';
import { OrdersService } from './orders.service';
import { Order } from './entities/orders.entity';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() order: CreateOrderDTO) {
    return this.ordersService.create(order);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDTO) {
    return this.ordersService.update(id, dto);
  }

  @Get()
  listAll(): Promise<Order[]> {
    return this.ordersService.listAll();
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }
}

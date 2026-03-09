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
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

import { Order } from '../domain/entities/order.entity';
import { OrdersService } from '../application/orders.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/infra/guards/roles.guard';
import { AuthenticatedRequest } from '../../auth/infra/interfaces/authenticated-request';
import { Roles } from '../../auth/infra/decorators/roles.decorator';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() dto: CreateOrderDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<Order> {
    return this.ordersService.create(dto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<Order> {
    return this.ordersService.update(id, dto, req.user.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Order | null> {
    return this.ordersService.findById(id, req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  listAll(): Promise<Order[]> {
    return this.ordersService.listAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.ordersService.delete(id, req.user.userId);
  }
}

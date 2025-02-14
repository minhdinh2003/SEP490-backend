import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { OrderStatus, Prisma, Role, Status } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import {OrderService } from './order.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { OrderEntity } from 'src/model/entity/order.entity';
import { OrderDto } from 'src/model/dto/order.dto';
import { AuthGuard } from 'src/core/auth.guard';
import { OrderItemRequest } from 'src/model/request/orderItem.request';

@ApiTags('Order')
@Controller('api/order')
@UseGuards(AuthGuard)
export class OrderController extends BaseController<OrderEntity, Prisma.OrderCreateInput> {
    @EntityType(OrderEntity)
    entity:OrderEntity;

    @ModelType(OrderDto)
    model:OrderDto;
    constructor(private orderservice: OrderService, coreSevice: CoreService) {
        super("order", coreSevice, orderservice);
    }

    @Post("test")
    @ApiBody({ type:OrderDto })
    async apiTest(@Body() param:OrderDto) {
        return null;
    }

    @Post("createOrder")
    @ApiBody({ type:OrderDto })
    async createOrder(@Body() param:OrderItemRequest[]) {
        return this.orderservice.createOrder(param);
    }

    @Put("status")
    @ApiBody({ })
    async updateStatus(@Query() orderId: number, @Query() status: OrderStatus) {
        return this.orderservice.updateStatus(orderId, status);
    }


}

import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import {OrderHistoryService } from './orderHistory.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { OrderHistoryEntity } from 'src/model/entity/order.entity';
import { OrderHistoryDto } from 'src/model/dto/order.dto';
import { AuthGuard } from 'src/core/auth.guard';

@ApiTags('OrderHistory')
@Controller('api/orderHistory')
@UseGuards(AuthGuard)
export class OrderHistoryController extends BaseController<OrderHistoryEntity, Prisma.OrderHistoryCreateInput> {
    @EntityType(OrderHistoryEntity)
    entity:OrderHistoryEntity;

    @ModelType(OrderHistoryDto)
    model:OrderHistoryDto;
    constructor(private service: OrderHistoryService, coreSevice: CoreService) {
        super("orderHistory", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type:OrderHistoryDto })
    async apiTest(@Body() param:OrderHistoryDto) {
        return null;
    }



}

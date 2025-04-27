import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { OrderStatus, Prisma, Role, Status } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { OrderService } from './order.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { OrderEntity } from 'src/model/entity/order.entity';
import { OrderDto } from 'src/model/dto/order.dto';
import { AuthGuard } from 'src/core/auth.guard';
import { CreateOrderRequest, CreateOrderRequestRepair, OrderItemRequest } from 'src/model/request/orderItem.request';
import { PayOSService } from 'src/common/services/payos/PayOS.service';
import { Public } from 'src/utils/public.decorator';
import { Response } from 'express';
import { ServiceResponse } from 'src/model/response/service.response';

@ApiTags('Order')
@Controller('api/order')
@UseGuards(AuthGuard)
export class OrderController extends BaseController<OrderEntity, Prisma.OrderCreateInput> {
    @EntityType(OrderEntity)
    entity: OrderEntity;

    @ModelType(OrderDto)
    model: OrderDto;
    constructor(private orderservice: OrderService,
        coreSevice: CoreService,
        protected readonly payosService: PayOSService
    ) {
        super("order", coreSevice, orderservice);
    }

    @Post("test")
    @ApiBody({ type: OrderDto })
    async apiTest(@Body() param: OrderDto) {
        return null;
    }

    @Post("createOrder")
    @ApiBody({ type: CreateOrderRequest })
    async createOrder(@Body() param: CreateOrderRequest) {
        return  ServiceResponse.onSuccess( await this.orderservice.createOrder(param));
    }

    @Post("createOrderRepair")
    @ApiBody({ type: CreateOrderRequestRepair })
    async createOrderRepair(@Body() param: CreateOrderRequestRepair) {
        return  ServiceResponse.onSuccess( await this.orderservice.createOrderRepair(param));
    }

    @Put("status")
    @ApiBody({})
    async updateStatus(@Query('orderId') orderId: number, @Query('status') status: OrderStatus) {
        return this.orderservice.updateStatus(orderId, status);
    }

    @Put("refund")
    @ApiBody({})
    async refund(@Query('orderId') orderId: number) {
        return ServiceResponse.onSuccess(await this.orderservice.refund(orderId));
    }

    @Public()
    @Get("cancelurl")
    async cancelurl(@Query() query: any, @Res() res: Response) {
        let link = '';
        if (Object.keys(query).length) {
            link = await this.orderservice.processCancelURL(query);
        }
        return res.redirect(link);
    }

    @Public()
    @Get("returnurl")
    async return(@Query() query: any, @Res() res: Response) {
        let link = '';
        console.log("returnurl")
        if (Object.keys(query).length) {
            link = await this.orderservice.processReturnURL(query);
        }
        return res.redirect(link);
    }

    @Public()
    @Get("cancelurlrequest")
    async cancelurlrequest(@Query() query: any, @Res() res: Response) {
        let link = '';
        if (Object.keys(query).length) {
            link = await this.orderservice.processCancelURLRequest(query);
        }
        return res.redirect(link);
    }

    @Public()
    @Get("returnurlrequest")
    async returnrequest(@Query() query: any, @Res() res: Response) {
        let link = '';
        console.log("returnurl")
        if (Object.keys(query).length) {
            link = await this.orderservice.processReturnURLRequest(query);
        }
        return res.redirect(link);
    }

}

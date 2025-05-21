import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { VoucherService } from './voucher.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { VoucherDto } from 'src/model/dto/voucher.dto';
import { VoucherEntity } from 'src/model/entity/voucher.entity';
import { ServiceResponse } from 'src/model/response/service.response';
import { ApplyVoucherRequest } from 'src/model/request/applyVoucher.request';
import { AuthGuard } from 'src/core/auth.guard';

@ApiTags('Voucher')
@Controller('api/voucher')
@UseGuards(AuthGuard)
export class VoucherController extends BaseController<VoucherEntity, Prisma.VoucherCreateInput> {
    @EntityType(VoucherEntity)
    entity: VoucherEntity;

    @ModelType(VoucherDto)
    model: VoucherDto;
    constructor(private service: VoucherService, coreSevice: CoreService) {
        super("voucher", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: VoucherDto })
    async apiTest(@Body() param: VoucherDto) {
        return null;
    }

    @Post("apply")
    async getNotification(@Body() param: ApplyVoucherRequest) {
        // to-do
        return ServiceResponse.onSuccess(await this.service.apply(param.voucherCode, param.productId, param.quantity));
    }
}

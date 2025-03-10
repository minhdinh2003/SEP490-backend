import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { VoucherService } from './voucher.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { VoucherEntity } from 'src/model/entity/voucher.entity';
import { VoucherDto } from 'src/model/dto/voucher.dto';

@ApiTags('Voucher')
@Controller('api/voucher')
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

}

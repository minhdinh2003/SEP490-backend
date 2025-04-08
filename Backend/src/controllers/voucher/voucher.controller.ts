import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
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

  constructor(
    private readonly service: VoucherService,
    coreService: CoreService,
  ) {
    super('voucher', coreService, service);
  }

  @Post()
  async createVoucher(@Body(new ValidationPipe({ whitelist: true })) dto: VoucherDto) {
    this.service.validateVoucherDates(dto.validFrom, dto.validTo, dto.expiryDate);

    const voucher = await this.service.create(dto);
    return {
      success: true,
      message: 'Tạo voucher thành công',
      data: voucher,
    };
  }

  @Post('apply')
  @ApiBody({ type: VoucherDto })
  async applyVoucher(@Body() body: { code: string }) {
    const result = await this.service.isVoucherValid(body.code);

    if (!result.voucher) {
      throw new NotFoundException(result.reason);
    }

    if (!result.valid) {
      throw new BadRequestException(result.reason);
    }

    return {
      success: true,
      message: 'Voucher hợp lệ',
      data: result.voucher,
    };
  }

  @Get(':code')
  async getVoucherByCode(@Param('code') code: string) {
    const voucher = await this.service.findOne({ where: { code } });
    if (!voucher) {
      throw new NotFoundException('Không tìm thấy voucher');
    }
    return voucher;
  }
}

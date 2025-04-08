import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { VoucherEntity } from 'src/model/entity/voucher.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class VoucherService extends BaseService<VoucherEntity, Prisma.VoucherCreateInput> {
  constructor(
    coreService: CoreService,
    protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, coreService);
  }

  validateVoucherDates(validFrom: Date, validTo: Date, expiryDate: Date): void {
    const now = new Date();

    if (validFrom < now) {
      throw new BadRequestException('startDate không được ở quá khứ');
    }

    if (validTo < now) {
      throw new BadRequestException('endDate không được ở quá khứ');
    }

    if (expiryDate < now) {
      throw new BadRequestException('expiryDate không được ở quá khứ');
    }

    if (validFrom > validTo) {
      throw new BadRequestException('startDate phải nhỏ hơn hoặc bằng endDate');
    }

    if (validTo> expiryDate) {
      throw new BadRequestException('endDate phải nhỏ hơn hoặc bằng expiryDate');
    }
  }

  async isVoucherValid(code: string): Promise<{ valid: boolean; reason?: string; voucher?: VoucherEntity }> {
    const voucher = await this.findOne({ where: { code } });

    if (!voucher) {
      return { valid: false, reason: 'Voucher không tồn tại' };
    }

    const now = new Date();

    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, reason: 'Voucher đã hết lượt sử dụng', voucher };
    }

    if (voucher.expiryDate && now > new Date(voucher.expiryDate)) {
      return { valid: false, reason: 'Voucher đã hết hạn', voucher };
    }

    if (voucher.startDate && now < new Date(voucher.startDate)) {
      return { valid: false, reason: 'Voucher chưa được kích hoạt', voucher };
    }

    if (voucher.endDate && now > new Date(voucher.endDate)) {
      return { valid: false, reason: 'Voucher đã hết thời gian áp dụng', voucher };
    }

    return { valid: true, voucher };
  }
}

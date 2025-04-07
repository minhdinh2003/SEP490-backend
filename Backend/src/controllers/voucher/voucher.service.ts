import { Injectable } from '@nestjs/common';
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

  // Kiểm tra voucher còn hạn và đúng ngày áp dụng
  async isVoucherValid(code: string): Promise<{ valid: boolean; reason?: string; voucher?: VoucherEntity }> {
    const voucher = await this.findOne({ where: { code } });

    if (!voucher) {
      return { valid: false, reason: 'Voucher không tồn tại' };
    }

    // Kiểm tra số lần sử dụng
    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, reason: 'Voucher đã hết lượt sử dụng', voucher };
    }

    // Kiểm tra hạn
    const now = new Date();
    if (voucher.expiryDate && now > new Date(voucher.expiryDate)) {
      return { valid: false, reason: 'Voucher đã hết hạn', voucher };
    }

    // Kiểm tra ngày áp dụng nếu có (giả sử bạn đã thêm trường validDates)
    if ((voucher as any).validDates?.length > 0) {
      const today = now.toISOString().split('T')[0];
      if (!(voucher as any).validDates.includes(today)) {
        return { valid: false, reason: 'Voucher không áp dụng hôm nay', voucher };
      }
    }

    return { valid: true, voucher };
  }
}

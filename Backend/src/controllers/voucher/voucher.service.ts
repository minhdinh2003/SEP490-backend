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
  
    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, reason: 'Voucher đã hết lượt sử dụng', voucher };
    }
  
    const now = new Date();
  
    if (voucher.expiryDate && now > new Date(voucher.expiryDate)) {
      return { valid: false, reason: 'Voucher đã hết hạn', voucher };
    }
  
    if (voucher. validFrom && now < new Date(voucher.startDate)) {
      return { valid: false, reason: 'Voucher chưa được kích hoạt', voucher };
    }
  
    if (voucher. validTo && now > new Date(voucher.endDate)) {
      return { valid: false, reason: 'Voucher đã hết thời gian áp dụng', voucher };
    }
  
    return { valid: true, voucher };
  }
  
}

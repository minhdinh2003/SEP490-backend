import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';
import { PromotionEntity } from './promotion.entity';

export class VoucherEntity extends BaseEntity {
  id: number; // Khóa chính tự động tăng

  @AutoMap()
  code: string; // Mã giảm giá (duy nhất)

  @AutoMap()
  promotionId: number; // ID của chương trình khuyến mãi

  @AutoMap()
  discount: number; // Phần trăm giảm giá (ví dụ: 10.00 = 10%)

  @AutoMap()
  usageLimit: number; // Số lần sử dụng tối đa

  @AutoMap()
  usedCount: number; // Số lần đã sử dụng

  @AutoMap()
  expiryDate: Date; // Ngày hết hạn của mã giảm giá

  @AutoMap()
  validFrom: Date; // Ngày hết hạn của mã giảm giá

  @AutoMap()
  validTo: Date; // Ngày hết hạn của mã giảm giá

  promotion: PromotionEntity;

  constructor(partial?: Partial<VoucherEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}
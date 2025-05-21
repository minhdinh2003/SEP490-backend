import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';

export class TransactionEntity extends BaseEntity {
  id: number; // ID tự động tăng

  @AutoMap()
  orderId: number; // ID của đơn hàng

  @AutoMap()
  description?: string; // Mô tả giao dịch (tùy chọn)

  @AutoMap()
  userId: number; // ID của người dùng

  @AutoMap()
  object?: string; // Đối tượng liên quan (có thể null)

  @AutoMap()
  paymentMethod: number; // Phương thức thanh toán

  constructor(partial?: Partial<TransactionEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}
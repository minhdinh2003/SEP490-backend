import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class TransactionDto extends BaseDto {
  @ApiProperty()
  @AutoMap()
  id: number; // ID tự động tăng

  @ApiProperty()
  @AutoMap()
  orderId: number; // ID của đơn hàng

  @ApiProperty({ required: false })
  @AutoMap()
  description?: string; // Mô tả giao dịch (tùy chọn)

  @ApiProperty()
  @AutoMap()
  userId: number; // ID của người dùng

  @ApiProperty({ required: false })
  @AutoMap()
  object?: string; // Đối tượng liên quan (có thể null)

  @ApiProperty()
  @AutoMap()
  paymentMethod: number; // Phương thức thanh toán

  constructor(partial?: Partial<TransactionDto>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
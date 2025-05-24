import { BaseEntity } from './base.entity';
import { OrderStatus } from '@prisma/client';
import { AutoMap } from '@automapper/classes';
import { ProductEntity } from './product.entity';
import { RequestEntity } from './request.entity';

export class OrderEntity extends BaseEntity {
  id: number; // Khóa chính tự động tăng

  @AutoMap()
  userId: number; // ID của người dùng

  @AutoMap()
  totalAmount: number; // Tổng số tiền của đơn hàng

  @AutoMap()
  status: OrderStatus; // Trạng thái đơn hàng

  @AutoMap()
  paymentMethod: number;

  @AutoMap()
  fullName: string;

  @AutoMap()
  address: string;

  @AutoMap()
  phoneNumber: string;
  @AutoMap()
  requestId: number;
  @AutoMap()
  voucherCode: string; // Mã giảm giá (nếu có)

  @AutoMap()
  isConfirmRefund: boolean;

  @AutoMap()
  isPay: boolean;

  orderItems: OrderItemEntity[];
  Request: RequestEntity;
  constructor(partial?: Partial<OrderEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}

export class OrderItemEntity extends BaseEntity {
  id: number; // Khóa chính tự động tăng

  @AutoMap()
  orderId: number; // ID của đơn hàng

  @AutoMap()
  productId: number; // ID của sản phẩm

  @AutoMap()
  quantity: number; // Số lượng sản phẩm trong đơn hàng

  @AutoMap()
  price: number; // Giá của sản phẩm tại thời điểm đặt hàng

  product: ProductEntity;

  constructor(partial?: Partial<OrderItemEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}

export class OrderHistoryEntity extends BaseEntity {
  id: number; // Khóa chính tự động tăng

  @AutoMap()
  orderId: number; // ID của đơn hàng

  @AutoMap()
  status: OrderStatus; // Trạng thái đơn hàng

  constructor(partial?: Partial<OrderHistoryEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}
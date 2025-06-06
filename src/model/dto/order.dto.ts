import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { OrderStatus } from '@prisma/client';
import { ProductDto } from './product.dto';
import { RequestDto } from './request.dto';

export class OrderDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    userId: number; // ID của người dùng

    @ApiProperty()
    @AutoMap()
    requestId: number;

    @ApiProperty()
    @AutoMap()
    totalAmount: number; // Tổng số tiền của đơn hàng

    @ApiProperty({ enum: OrderStatus })
    @AutoMap()
    status: OrderStatus; // Trạng thái đơn hàng

    @ApiProperty()
    @AutoMap()
    paymentMethod: number;

    @ApiProperty()
    @AutoMap()
    fullName: string;

    @ApiProperty()
    @AutoMap()
    address: string;

    @ApiProperty()
    @AutoMap()
    phoneNumber: string;
    @AutoMap()
    voucherCode: string; // Mã giảm giá (nếu có)

    @AutoMap()
    isConfirmRefund: boolean;

    @AutoMap()
    isPay: boolean;

    orderItems: OrderItemDto[];



    Request: RequestDto;
}

export class OrderItemDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    orderId: number; // ID của đơn hàng

    @ApiProperty()
    @AutoMap()
    productId: number; // ID của sản phẩm

    @ApiProperty()
    @AutoMap()
    quantity: number; // Số lượng sản phẩm trong đơn hàng

    @ApiProperty()
    @AutoMap()
    price: number; // Giá của sản phẩm tại thời điểm đặt hàng

    product: ProductDto;

}

export class OrderHistoryDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    orderId: number; // ID của đơn hàng

    @ApiProperty({ enum: OrderStatus })
    @AutoMap()
    status: OrderStatus; // Trạng thái đơn hàng
}
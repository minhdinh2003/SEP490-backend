import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';


export class PromotionDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    name: string; // Tên chương trình khuyến mãi

    @ApiProperty({ required: false })
    @AutoMap()
    description?: string; // Mô tả chi tiết (tùy chọn)

    @ApiProperty()
    @AutoMap()
    discount: number; // Phần trăm giảm giá (ví dụ: 10.00 = 10%)

    @ApiProperty()
    @AutoMap()
    startDate: Date; // Ngày bắt đầu khuyến mãi

    @ApiProperty()
    @AutoMap()
    endDate: Date; // Ngày kết thúc khuyến mãi

    @ApiProperty()
    @AutoMap()
    times: number; // Số lần áp dụng khuyến mãi

    @ApiProperty()
    @AutoMap()
    productId: number; // ID của sản phẩm liên quan

    @AutoMap()
    image: any;
    @AutoMap()
    content: string;

    @AutoMap()
    type: any;

    @AutoMap()
    discountType: any;

    @AutoMap()
    discountValue: any;

    @AutoMap()
    minUseRequest: number;

    @AutoMap()
    minUseAmount: number;

}
import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { PromotionDto } from './promotion.dto';

export class VoucherDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    code: string; // Mã giảm giá (duy nhất)

    @ApiProperty()
    @AutoMap()
    promotionId: number; // ID của chương trình khuyến mãi

    @ApiProperty()
    @AutoMap()
    discount: number; // Phần trăm giảm giá (ví dụ: 10.00 = 10%)

    @ApiProperty()
    @AutoMap()
    usageLimit: number; // Số lần sử dụng tối đa

    @ApiProperty()
    @AutoMap()
    usedCount: number; // Số lần đã sử dụng

    @ApiProperty()
    @AutoMap()
    validFrom: Date; // Ngày hết hạn của mã giảm giá

    @ApiProperty()
    @AutoMap()
    validTo: Date; // Ngày hết hạn của mã giảm giá

    promotion: PromotionDto;

}
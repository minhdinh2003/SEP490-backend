import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

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
    expiryDate: Date; // Ngày hết hạn của mã giảm giá

    @ApiProperty()
    @AutoMap()
    validFrom: Date;

    @ApiProperty()
    @AutoMap()
    validTo: Date;


}
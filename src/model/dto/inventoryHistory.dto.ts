import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class InventoryHistoryDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    productId: number; // ID của sản phẩm

    @ApiProperty()
    @AutoMap()
    quantityChange: number; // Số lượng thay đổi (+ hoặc -)

    @ApiProperty({ required: false })
    @AutoMap()
    description?: string; // Mô tả (lý do thay đổi)

    constructor(partial?: Partial<InventoryHistoryDto>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
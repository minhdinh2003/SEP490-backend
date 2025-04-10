import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class InventoryDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    productId: number; // ID của sản phẩm

    @ApiProperty()
    @AutoMap()
    quantity: number; // Số lượng sản phẩm trong kho

    constructor(partial?: Partial<InventoryDto>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
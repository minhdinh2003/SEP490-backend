import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { ProductDto } from './product.dto';

export class WhitelistDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    userId: number; // ID của người dùng

    @ApiProperty()
    @AutoMap()
    productId: number; // ID của sản phẩm

    product?: ProductDto;

    constructor(partial?: Partial<WhitelistDto>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
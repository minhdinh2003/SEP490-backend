import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { ProductDto } from './product.dto';

export class ReviewDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    userId: number; // ID của người dùng

    @ApiProperty()
    @AutoMap()
    productId: number; // ID của sản phẩm

    @ApiProperty({ minimum: 1, maximum: 5 })
    @AutoMap()
    rating: number; // Số sao đánh giá (1-5)

    @ApiProperty({ required: false })
    @AutoMap()
    comment?: string; // Nội dung đánh giá (tùy chọn)

    @ApiProperty()
    @AutoMap()
    fullName?: string; // Nội dung đánh giá (tùy chọn)

    product?: ProductDto;

    constructor(partial?: Partial<ReviewDto>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
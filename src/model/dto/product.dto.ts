import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Category, PartType, Review, Status } from '@prisma/client';
import { InventoryDto } from './inventory.dto';
import { BrandDto } from './brand.dto';
import { ReviewDto } from './review.dto';

export class ProductDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @ApiProperty()
    @AutoMap()
    name: string; // Tên sản phẩm

    @ApiProperty()
    @AutoMap()
    description?: string; // Mô tả sản phẩm (có thể null)

    @ApiProperty()
    @AutoMap()
    price: number; // Giá sản phẩm

    @ApiProperty()
    @AutoMap()
    category: Category; // Loại sản phẩm: 'car' hoặc 'part'

    @ApiProperty()
    @AutoMap()
    model?: string; // Mẫu xe (nếu là xe)

    @ApiProperty()
    @AutoMap()
    year?: number; // Năm sản xuất (nếu là xe)

    @ApiProperty()
    @AutoMap()
    status: Status; // Trạng thái sản phẩm

    @ApiProperty()
    @AutoMap()
    listImage?: any; // Danh sách hình ảnh (JSON)

    @ApiProperty()
    @AutoMap()
    style?: string; // Kiểu dáng

    @ApiProperty()
    @AutoMap()
    engine_capacity?: string; // Dung tích động cơ

    @ApiProperty()
    @AutoMap()
    fuel_type?: string; // Loại nhiên liệu

    @ApiProperty()
    @AutoMap()
    transmission?: string; // Hộp số

    @ApiProperty()
    @AutoMap()
    mileage?: number; // Chỉ số đồng hồ (số km đã đi)

    @ApiProperty()
    @AutoMap()
    exterior_color?: string; // Màu xe

    @ApiProperty()
    @AutoMap()
    interior_color?: string; // Màu nội thất

    @ApiProperty()
    @AutoMap()
    origin?: string; // Xuất xứ

    @ApiProperty()
    @AutoMap()
    seats?: number; // Số chỗ ngồi

    @ApiProperty()
    @AutoMap()
    doors?: number; // Số cửa

    @ApiProperty()
    @AutoMap()
    createdAt: Date; // Thời gian tạo

    @ApiProperty()
    @AutoMap()
    updatedAt: Date; // Thời gian cập nhật

    @ApiProperty()
    @AutoMap()
    address?: string;

    @ApiProperty()
    @AutoMap()
    promotionId?: number; // ID của chương trình khuyến mãi (tùy chọn)

    @ApiProperty()
    @AutoMap()
    partType?: PartType; // ID của chương trình khuyến mãi (tùy chọn)

    inventory: InventoryDto;
    brands?: BrandDto[];
    review?: ReviewDto[];

    constructor(partial: Partial<ProductDto>) {
        super();
        Object.assign(this, partial);
    }
}
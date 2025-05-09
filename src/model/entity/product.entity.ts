import { BaseEntity } from './base.entity';
import { Category, PartType, Review, Status } from '@prisma/client'; // Giả sử bạn đã định nghĩa enum trong Prisma
import { AutoMap } from '@automapper/classes';
import { InventoryEntity } from './inventory.entity';
import { BrandEntity } from './brand.entity';
import { ReviewEntity } from './review.entity';

export class ProductEntity extends BaseEntity {
    id: number; // Khóa chính tự động tăng

    @AutoMap()
    name: string; // Tên sản phẩm

    @AutoMap()
    description?: string; // Mô tả sản phẩm (có thể null)

    @AutoMap()
    price: number; // Giá sản phẩm

    @AutoMap()
    category: Category; // Loại sản phẩm: 'car' hoặc 'part'

    @AutoMap()
    model?: string; // Mẫu xe (nếu là xe)

    @AutoMap()
    year?: number; // Năm sản xuất (nếu là xe)

    @AutoMap()
    status: Status; // Trạng thái sản phẩm

    @AutoMap()
    listImage?: any; // Danh sách hình ảnh (JSON)

    @AutoMap()
    style?: string; // Kiểu dáng

    @AutoMap()
    engine_capacity?: string; // Dung tích động cơ

    @AutoMap()
    fuel_type?: string; // Loại nhiên liệu

    @AutoMap()
    transmission?: string; // Hộp số

    @AutoMap()
    mileage?: number; // Chỉ số đồng hồ (số km đã đi)

    @AutoMap()
    exterior_color?: string; // Màu xe

    @AutoMap()
    interior_color?: string; // Màu nội thất

    @AutoMap()
    origin?: string; // Xuất xứ

    @AutoMap()
    seats?: number; // Số chỗ ngồi

    @AutoMap()
    doors?: number; // Số cửa

    @AutoMap()
    partType?: PartType; // ID của chương trình khuyến mãi (tùy chọn)

    lastLogin?: Date; // Thời gian đăng nhập cuối cùng (có thể null)

    createdAt: Date; // Thời gian tạo

    updatedAt: Date; // Thời gian cập nhật

    inventory: InventoryEntity;

    brandInfo?: any;

    brands?: BrandEntity[];

    review?: ReviewEntity[];

    constructor(partial?: Partial<ProductEntity>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
    }
}



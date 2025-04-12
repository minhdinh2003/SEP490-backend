import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';

export class PromotionEntity extends BaseEntity {
    id: number; // Khóa chính tự động tăng

    @AutoMap()
    name: string; // Tên chương trình khuyến mãi

    @AutoMap()
    description?: string; // Mô tả chi tiết (tùy chọn)

    @AutoMap()
    discount: number; // Phần trăm giảm giá (ví dụ: 10.00 = 10%)

    @AutoMap()
    startDate: Date; // Ngày bắt đầu khuyến mãi

    @AutoMap()
    endDate: Date; // Ngày kết thúc khuyến mãi

    @AutoMap()
    times: number; // Số lần áp dụng khuyến mãi

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

    constructor(partial?: Partial<PromotionEntity>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
    }
}
import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';

export class InventoryHistoryEntity extends BaseEntity {
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @AutoMap()
    productId: number; // ID của sản phẩm

    @AutoMap()
    quantityChange: number; // Số lượng thay đổi (+ hoặc -)

    @AutoMap()
    description?: string; // Mô tả (lý do thay đổi)

    constructor(partial?: Partial<InventoryHistoryEntity>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
    }
}
import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';

export class InventoryEntity extends BaseEntity {
    @AutoMap()
    id: number; // Khóa chính tự động tăng

    @AutoMap()
    productId: number; // ID của sản phẩm

    @AutoMap()
    quantity: number; // Số lượng sản phẩm trong kho

    constructor(partial?: Partial<InventoryEntity>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
    }
}
import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';
import { ProductEntity } from './product.entity';

export class WhitelistEntity extends BaseEntity {
    id: number; // Khóa chính tự động tăng

    @AutoMap()
    userId: number; // ID của người dùng

    @AutoMap()
    productId: number; // ID của sản phẩm

    product?: ProductEntity;

    constructor(partial?: Partial<WhitelistEntity>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
    }
}
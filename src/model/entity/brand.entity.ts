import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base.entity';

export class BrandEntity extends BaseEntity {
  @AutoMap()
  id: number; // Khóa chính, tự động tăng
  @AutoMap()
  name: string; // Tên thương hiệu
  @AutoMap()
  description?: string; // Mô tả thương hiệu (có thể null)
  @AutoMap()
  logoURL?: string; // Đường dẫn hình ảnh logo (có thể null)

  constructor(partial?: Partial<BrandEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}
import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class BrandDto extends BaseDto {
  @ApiProperty()
  @AutoMap()
  id: number; // Khóa chính, tự động tăng

  @ApiProperty()
  @AutoMap()
  name: string; // Tên thương hiệu

  @ApiProperty()
  @AutoMap()
  description?: string; // Mô tả thương hiệu (có thể null)

  @ApiProperty()
  @AutoMap()
  logoURL?: string; // Đường dẫn hình ảnh logo (có thể null)

  // Phương thức khởi tạo để tạo một BrandDto từ dữ liệu
  constructor(partial: Partial<BrandDto>) {
    super();
    Object.assign(this, partial);
  }
}
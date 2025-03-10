import { BaseEntity } from './base.entity'; // Giả định rằng bạn có một lớp base entity
import { AutoMap } from '@automapper/classes';

export class FileEntity extends BaseEntity {
  @AutoMap()
  id: number; // Khóa chính, tự động tăng

  @AutoMap()
  fileKey: string; // Key của file từ UploadThing

  @AutoMap()
  fileUrl: string; // URL file từ UploadThing

  @AutoMap()
  appUrl: string; // Đường dẫn URL trong ứng dụng

  @AutoMap()
  fileName: string; // Tên file

  @AutoMap()
  fileType: string; // Loại file (ví dụ: image/png)

  @AutoMap()
  fileSize: number; // Kích thước file

  @AutoMap()
  isTemp: boolean; // Đánh dấu file là tạm thời hay không

  @AutoMap()
  associatedTableType?: string; // Loại bảng liên kết (User, Course, ...)

  @AutoMap()
  associatedTableId?: number; // ID của bảng liên kết


  // Phương thức khởi tạo để tạo một FileEntity từ dữ liệu
  constructor(partial?: Partial<FileEntity>) {
    super();
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
  }
}

import { BaseEntity } from "./base.entity";
import { Role, Gender } from "@prisma/client";
import { AutoMap } from '@automapper/classes';

export class UserEntity extends BaseEntity {
  id: number; // Khóa chính, tự động tăng
  @AutoMap()
  fullName: string; // Họ và tên đầy đủ
  @AutoMap()
  email: string; // Địa chỉ email duy nhất
  passwordHash: string; // Mã hóa mật khẩu
  @AutoMap()
  role: Role; // Vai trò người dùng (enum)
  @AutoMap()
  gender: Gender; // Giới tính (enum)
  @AutoMap()
  dateOfBirth?: Date; // Ngày sinh (có thể null)
  @AutoMap()
  phoneNumber?: string; // Số điện thoại (có thể null)
  @AutoMap()
  addressLine1?: string; // Địa chỉ 1 (có thể null)
  @AutoMap()
  addressLine2?: string; // Địa chỉ 2 (có thể null)
  @AutoMap()
  province?: string; // Thành phố (có thể null)
  @AutoMap()
  district?: string; // Bang hoặc tỉnh (có thể null)
  @AutoMap()
  ward?: string; // Quốc gia (có thể null)
  @AutoMap()
  profilePictureURL?: string; // URL ảnh đại diện (có thể null)
  @AutoMap()
  description?: string; // Mô tả người dùng

  @AutoMap()
  isConfirm?: any;

  constructor(partial?: Partial<UserEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }

    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
  }
}
import { AutoMap } from "@automapper/classes";

// base.entity.ts
export class BaseDto {
    @AutoMap()
    createdAt: Date; // Thời gian tạo tài khoản
    @AutoMap()
    updatedAt: Date; // Thời gian cập nhật tài khoản
    @AutoMap()
    createdBy: string; // Người tạo (có thể null)
    @AutoMap()
    updatedBy: string; // Người cập nhật (có thể null)

  }
  
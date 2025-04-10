// base.entity.ts
export class BaseEntity {
    createdAt: Date; // Thời gian tạo tài khoản
    updatedAt: Date; // Thời gian cập nhật tài khoản
    createdBy: string; // Người tạo (có thể null)
    updatedBy: string; // Người cập nhật (có thể null)

  }
  
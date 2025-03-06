
import { BaseEntity } from "./base.entity";
// user.entity.ts
export class OTPEntity extends BaseEntity {
  id: number; // Khóa chính, tự động tăng
  email: string; 
  otp: string;
  expiryTime: Date; 
}

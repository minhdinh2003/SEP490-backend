// src/express.d.ts
import { UserEntity } from './model/entity/user.entity'; // Đường dẫn đến UserEntity (đảm bảo đường dẫn chính xác)

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity; // Thêm thuộc tính user vào Request
  }
}

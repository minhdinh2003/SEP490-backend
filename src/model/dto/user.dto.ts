import { AutoMap } from "@automapper/classes";
import { BaseDto } from "./base.dto";
import { Role, Gender } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
// user.entity.ts
export class UserDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính, tự động tăng
    @AutoMap()
    @ApiProperty()
    fullName: string; // Họ và tên đầy đủ
    @AutoMap()
    @ApiProperty()
    email: string; // Địa chỉ email duy nhất
    @AutoMap()
    @ApiProperty()
    role: Role; // Vai trò người dùng (enum)
    @AutoMap()
    @ApiProperty()
    gender: Gender; // Giới tính (enum)
    @AutoMap()
    @ApiProperty()
    dateOfBirth?: Date; // Ngày sinh (có thể null)

    @AutoMap()
    @ApiProperty()
    phoneNumber?: string; // Số điện thoại (có thể null)
    @AutoMap()
    @ApiProperty()
    addressLine1?: string; // Địa chỉ 1 (có thể null)
    @AutoMap()
    @ApiProperty()
    addressLine2?: string; // Địa chỉ 2 (có thể null)
    @AutoMap()
    @ApiProperty()
    province?: string; // Thành phố (có thể null)
    @AutoMap()
    @ApiProperty()
    district?: string; // Bang hoặc tỉnh (có thể null)

    @AutoMap()
    @ApiProperty()
    ward?: string; // Quốc gia (có thể null)

    @AutoMap()
    @ApiProperty()
    profilePictureURL?: string; // URL ảnh đại diện (có thể null)

    // Phương thức khởi tạo để tạo một UserEntity từ dữ liệu
    constructor(partial: Partial<BaseDto>) {
        super();
        Object.assign(this, partial);
    }
}


export class UserDetail extends UserDto {
    coinAmount?: any;
}
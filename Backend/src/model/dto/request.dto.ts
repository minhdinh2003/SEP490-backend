import { BaseDto } from "./base.dto";
import { UserDto } from "./user.dto";
import { RequestStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from '@automapper/classes';

export class RequestDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number;

    @ApiProperty()
    @AutoMap()
    userId: number;

    @ApiProperty({ type: () => UserDto })
    @AutoMap(() => UserDto)
    user: UserDto;

    @ApiProperty()
    @AutoMap()
    description: string;

    @ApiProperty({ enum: RequestStatus })
    @AutoMap()
    status: RequestStatus;

    @ApiProperty({ required: false })
    @AutoMap()
    price?: number;

    @ApiProperty({ required: false })
    @AutoMap()
    approvedId?: number;

    @ApiProperty({ type: () => UserDto, required: false })
    @AutoMap(() => UserDto)
    approver?: UserDto;

    @ApiProperty({ required: false })
    @AutoMap()
    completedAt?: Date;

    @ApiProperty({ required: false })
    @AutoMap()
    images: any; // Thay đổi thành kiểu dữ liệu cụ thể nếu có cấu trúc JSON xác định

    @ApiProperty()
    @AutoMap()
    isUserConfirm: boolean;

    @ApiProperty()
    @AutoMap()
    type: string;

    @ApiProperty()
    @AutoMap()
    reasonReject: string;

    constructor(partial?: Partial<RequestDto>) {
        super();
        Object.assign(this, partial);
    }
}
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { RequestStatus } from "@prisma/client";
import { AutoMap } from '@automapper/classes';

export class RequestEntity extends BaseEntity {
    @AutoMap()
    id: number;

    @AutoMap()
    userId: number;

    user: UserEntity;

    @AutoMap()
    description: string;

    @AutoMap()
    status: RequestStatus;

    @AutoMap()
    price?: number;

    @AutoMap()
    approvedId?: number;
    
    approver?: UserEntity;

    @AutoMap()
    completedAt?: Date;

    @AutoMap()
    images: any; // Thay đổi thành kiểu dữ liệu cụ thể nếu có cấu trúc JSON xác định

    @AutoMap()
    imageRepairs: any;
    
    @AutoMap()
    isUserConfirm: boolean;

    @AutoMap()
    isPay: boolean;

    @AutoMap()
    type: string;

    @AutoMap()
    reasonReject: string;

    @AutoMap()
    repairType: any;

    @AutoMap()
    address?: string;
    @AutoMap()
    TaskDetail: any[];

    constructor(partial?: Partial<RequestEntity>) {
        super();
        Object.assign(this, partial);
    }
}
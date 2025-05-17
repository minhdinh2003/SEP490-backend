import { BaseEntity } from "./base.entity";
import { RequestEntity } from "./request.entity";
import { UserEntity } from "./user.entity";
import { TaskStatus } from "@prisma/client";
import { AutoMap } from '@automapper/classes';

export class TaskDetailEntity extends BaseEntity {
    @AutoMap()
    id: number;

    @AutoMap()
    requestId: number;

    @AutoMap(() => RequestEntity)
    request: RequestEntity;

    @AutoMap()
    assignedTo?: number;

    @AutoMap(() => UserEntity)
    assignee?: UserEntity;

    @AutoMap()
    description: string;

    @AutoMap()
    title: string;

    @AutoMap()
    address: string;

    @AutoMap()
    status: TaskStatus;

    @AutoMap()
    deadline?: Date;

    @AutoMap()
    images?: any; // Thay đổi thành kiểu dữ liệu cụ thể nếu có cấu trúc JSON xác định

    @AutoMap()
    imageRepairs?: any;

    @AutoMap()
    isPay: boolean;

    @AutoMap()
    price?: number;
    @AutoMap()
    incidentalCosts?: number;
    @AutoMap()
    comments?: any; // Thay đổi thành kiểu dữ liệu cụ thể nếu có cấu trúc JSON xác định

    @AutoMap()
    items?: any;
    constructor(partial?: Partial<TaskDetailEntity>) {
        super();
        Object.assign(this, partial);
    }
}
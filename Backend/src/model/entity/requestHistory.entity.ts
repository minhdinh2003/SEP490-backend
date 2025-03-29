import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { RequestEntity } from "./request.entity";
import { RequestStatus } from "@prisma/client";
import { AutoMap } from '@automapper/classes';

export class RequestHistoryEntity extends BaseEntity {
    @AutoMap()
    id: number;

    @AutoMap()
    requestId: number;

    @AutoMap(() => RequestEntity)
    Request: RequestEntity;

    @AutoMap()
    status: RequestStatus;

    @AutoMap()
    comment?: string;

    @AutoMap()
    userId?: number;

    @AutoMap(() => UserEntity)
    User?: UserEntity;

    constructor(partial?: Partial<RequestHistoryEntity>) {
        super();
        Object.assign(this, partial);
    }
}
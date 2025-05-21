import { BaseEntity } from "./base.entity";
import { RequestEntity } from "./request.entity";
import { UserEntity } from "./user.entity";
import { AutoMap } from '@automapper/classes';

export class ChatEntity extends BaseEntity {
    @AutoMap()
    id: number;

    @AutoMap()
    requestId: number;

    @AutoMap(() => RequestEntity)
    request: RequestEntity;

    @AutoMap()
    senderId: number;

    @AutoMap(() => UserEntity)
    sender: UserEntity;

    @AutoMap()
    message: string;

    @AutoMap()
    receiveId: number;

    @AutoMap()
    isNormal: boolean;

    @AutoMap()
    isRead: boolean;

    constructor(partial?: Partial<ChatEntity>) {
        super();
        Object.assign(this, partial);
    }
}
import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { send } from 'node:process';
import { BaseService } from 'src/base/base.service';
import { NotificationType } from 'src/common/const/notification.type';
import { CoreService } from 'src/core/core.service';
import { ChatEntity } from 'src/model/entity/chat.entity';
import { SendRequest } from 'src/model/request/sendMess.request';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class ChatService extends BaseService<ChatEntity, Prisma.ChatCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    async add(entity: ChatEntity): Promise<number> {
        const id = await super.add(entity);

        var request = await this.prismaService.request.findFirst({
            where: {
                id: entity.requestId
            }
        })
        const userId = this._authService.getUserID();
        if (request.userId != userId) {
            await this.pushNotification(request.userId, NotificationType.PRODUCT_OWNER_CHAT_REQUEST,
                JSON.stringify({
                    id,
                    requestId: request.id,
                    message: entity.message
                }),
                this._authService.getFullname(), this._authService.getUserID()
            )
        } else {
            await this.pushNotificationToProductOnwer(NotificationType.USER_CHAT_REQUEST,
                JSON.stringify({
                    id,
                    requestId: request.id,
                    message: entity.message
                }),
                this._authService.getFullname(), this._authService.getUserID()
            )
        }


        return id;
    }

    async markAsRead(): Promise<void> {
        const userId = this._authService.getUserID();
        await this.prismaService.chat.updateMany({
            where: {
                receiveId: userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        })
    }

    async sendMessageToOwner(entity: SendRequest): Promise<number> {
        entity.requestId = -1;
        entity.isNormal = true;
        var data = new ChatEntity();
        data.requestId = entity.requestId;
        data.senderId = entity.senderId;    
        data.message = entity.message;
        data.isNormal = entity.isNormal;
        data.isRead = entity.isRead;
        // fix 1 owner
        const users = await this.prismaService.userRepo.getUserByRole(Role.OWNER);
        if (users && users.length > 0) {
            data.receiveId = users[0].id;
            const id = await super.add(data);
            await this.pushNotificationToProductOnwer(NotificationType.USER_CHAT_WITH_OWNER,
                JSON.stringify({
                    id,
                    senderId: this._authService.getUserID(),
                    message: entity.message
                }),
                this._authService.getFullname(), this._authService.getUserID()
            )
        }
        return 0;
    }

    async sendMessageToUser(entity: SendRequest): Promise<number> {
        entity.requestId = -1;
        entity.isNormal = true;
        var data = new ChatEntity();
        data.requestId = entity.requestId;
        data.senderId = entity.senderId;    
        data.message = entity.message;
        data.receiveId = entity.receiveId;
        data.isNormal = entity.isNormal;
        data.isRead = entity.isRead;
        const id = await super.add(data);
        // fix 1 owner
        await this.pushNotification( entity.receiveId,NotificationType.OWNER_CHAT_WITH_USER,
            JSON.stringify({
                id,
                requestId: entity.requestId,
                message: entity.message
            }),
            this._authService.getFullname(), this._authService.getUserID()
        )
        return 0;
    }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { NotificationType } from 'src/common/const/notification.type';
import { CoreService } from 'src/core/core.service';
import { ChatEntity } from 'src/model/entity/chat.entity';
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
}

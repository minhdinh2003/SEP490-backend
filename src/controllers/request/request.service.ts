import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequestStatus } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { NotificationType } from 'src/common/const/notification.type';
import { CoreService } from 'src/core/core.service';
import { RequestEntity } from 'src/model/entity/request.entity';
import { RequestHistoryEntity } from 'src/model/entity/requestHistory.entity';
import { UpdateRequestStatusRequest } from 'src/model/request/updateStatusRequest.request';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class RequestService extends BaseService<RequestEntity, Prisma.RequestCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    async add(entity: RequestEntity): Promise<number> {
        const id = await super.add(entity);

        // push notificatio to productowner
        await this.pushNotificationToProductOnwer(NotificationType.USER_SEND_REQUEST_PRODUCT_OWNER,
            JSON.stringify({
                id 
            }),
            this._authService.getFullname(), this._authService.getUserID()
        )

        return id;
    }

    async updateRequestStatus(
        requestId: number,
        param: UpdateRequestStatusRequest
      ) {
        // Bước 1: Tìm yêu cầu theo ID
        const request = await this.prismaService.request.findUnique({
          where: { id: requestId },
        });
    
        if (!request) {
          throw new NotFoundException(`Request with ID ${requestId} not found`);
        }
    
        // Bước 2: Cập nhật trạng thái mới cho yêu cầu
        const updatedRequest = await this.prismaService.request.update({
          where: { id: requestId },
          data: {
            status: param.status,
            updatedBy: this._authService.getFullname(),
            updatedAt: new Date(),
          },
        });
    
        // Bước 3: Tạo bản ghi lịch sử thay đổi trạng thái
        const historyData = {
            requestId: requestId,
            status: param.status,
            updatedBy: this._authService.getFullname(),
            comment: param.comment || null,
          };
        
        await this.prismaService.requestHistory.create({
          data: {
            ...historyData
          },
          select: {
            id: true
          }
        });

        switch(param.status){
            case RequestStatus.REJECTED:
                await this.pushNotification(request.userId, NotificationType.PRODUCT_OWNER_REJECT_REQUEST,
                    JSON.stringify({
                        id: request.id,
                        description: request.description 
                    }),
                    this._authService.getFullname(), this._authService.getUserID()
        
                )
                break;
        }
    
        // Bước 4: Trả về yêu cầu đã được cập nhật
        return updatedRequest;
      }
}

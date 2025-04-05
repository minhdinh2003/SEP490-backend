import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequestStatus, Role, TaskStatus } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { NotificationType } from 'src/common/const/notification.type';
import { CoreService } from 'src/core/core.service';
import { RequestEntity } from 'src/model/entity/request.entity';
import { UpdateRequestStatusRequest } from 'src/model/request/updateStatusRequest.request';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class RequestService extends BaseService<RequestEntity, Prisma.RequestCreateInput> {
  constructor(
    coreService: CoreService,
    protected readonly prismaService: PrismaService
  ) {
    super(prismaService, coreService);
  }

  async update(id: number, entity: Partial<RequestEntity>): Promise<boolean> {
    await super.update(id, entity);
    const updatedRequest = await super.getById(id);

    if (updatedRequest.status === RequestStatus.COMPLETED) {
      await this.pushNotification(
        updatedRequest.userId,
        NotificationType.DONE_REQUEST_USER,
        JSON.stringify({ id: updatedRequest.id, price: updatedRequest.price }),
        this._authService.getFullname(),
        this._authService.getUserID()
      );
    }

    return true;
  }

  async add(entity: RequestEntity): Promise<number> {
    const id = await super.add(entity);
    const role = this._authService.getRole();

    if (role === Role.OWNER || role === Role.EMPLOYEE) {
      await this.prismaService.request.update({
        where: { id },
        data: {
          status: RequestStatus.IN_PROGRESS,
          isUserConfirm: true
        }
      });
      await this.createDefaultTasks(id);
    } else {
      await this.pushNotificationToProductOnwer(
        NotificationType.USER_SEND_REQUEST_PRODUCT_OWNER,
        JSON.stringify({ id }),
        this._authService.getFullname(),
        this._authService.getUserID()
      );
    }

    return id;
  }

  async confirm(requestId: number) {
    const updatedRequest = await this.prismaService.request.update({
      where: { id: requestId },
      data: {
        updatedBy: this._authService.getFullname(),
        updatedAt: new Date(),
        isUserConfirm: true,
        status: RequestStatus.IN_PROGRESS
      }
    });

    const createdTasks = await this.createDefaultTasks(requestId);

    await this.pushNotificationToProductOnwer(
      NotificationType.USER_CONFIRM_REQUEST,
      JSON.stringify({ id: requestId }),
      this._authService.getFullname(),
      this._authService.getUserID()
    );

    return { updatedRequest, createdTasks };
  }

  async updateRequestStatus(requestId: number, param: UpdateRequestStatusRequest) {
    const request = await this.prismaService.request.findUnique({ where: { id: requestId } });

    if (!request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }

    const updatedRequest = await this.prismaService.request.update({
      where: { id: requestId },
      data: {
        status: param.status,
        updatedBy: this._authService.getFullname(),
        updatedAt: new Date(),
        reasonReject: param.comment,
        price: param.status === RequestStatus.APPROVED ? param.price : request.price,
        isUserConfirm: param.status === RequestStatus.APPROVED ? false : request.isUserConfirm
      }
    });

    await this.prismaService.requestHistory.create({
      data: {
        requestId,
        status: param.status,
        updatedBy: this._authService.getFullname(),
        comment: param.comment || null
      }
    });

    await this.sendStatusChangeNotification(param.status, request, param.price);

    return updatedRequest;
  }

  private async createDefaultTasks(requestId: number) {
    const deadlines = [14, 21]; // in days
    const titles = [
      'Sửa chữa hoặc thay thế linh kiện bị hỏng',
      'Kiểm tra chất lượng sau sửa chữa'
    ];

    const tasks = titles.map((title, index) => ({
      requestId,
      title,
      description: '',
      status: TaskStatus.PENDING,
      deadline: new Date(Date.now() + deadlines[index] * 24 * 60 * 60 * 1000),
      images: [],
      comments: []
    }));

    return await this.prismaService.taskDetail.createMany({ data: tasks });
  }

  private async sendStatusChangeNotification(status: RequestStatus, request: RequestEntity, price?: number) {
    let notificationType: NotificationType;
    let payload: any = { id: request.id };

    switch (status) {
      case RequestStatus.REJECTED:
        notificationType = NotificationType.PRODUCT_OWNER_REJECT_REQUEST;
        payload.description = request.description;
        break;
      case RequestStatus.APPROVED:
        notificationType = NotificationType.PRODUCT_OWNER_ACCEPT_REQUEST;
        payload.price = price;
        break;
      default:
        return;
    }

    await this.pushNotification(
      request.userId,
      notificationType,
      JSON.stringify(payload),
      this._authService.getFullname(),
      this._authService.getUserID()
    );
  }
}

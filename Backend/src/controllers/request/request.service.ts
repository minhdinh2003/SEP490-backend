import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequestStatus, TaskStatus } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { NotificationType } from 'src/common/const/notification.type';
import { CoreService } from 'src/core/core.service';
import { PrismaService } from 'src/repo/prisma.service';
import { RequestEntity } from 'src/model/entity/request.entity';
import { UpdateRequestStatusRequest } from 'src/model/request/updateStatusRequest.request';

@Injectable()
export class RequestService extends BaseService<RequestEntity, Prisma.RequestCreateInput> {
  constructor(
    coreService: CoreService,
    protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, coreService);
  }

  async add(entity: RequestEntity): Promise<number> {
    const id = await super.add(entity);

    // Push notification to product owner
    await this.pushNotificationToProductOwner(
      NotificationType.USER_SEND_REQUEST_PRODUCT_OWNER,
      JSON.stringify({ id }),
      this._authService.getFullname(),
      this._authService.getUserID()
    );

    return id;
  }

  async confirm(requestId: number) {
    const updatedRequest = await this.prismaService.request.update({
      where: { id: requestId },
      data: {
        updatedBy: this._authService.getFullname(),
        updatedAt: new Date(),
        isUserConfirm: true,
        status: RequestStatus.IN_PROGRESS,
      },
    });

    const tasks = this.createTasks(requestId);

    // Save tasks to the database
    const createdTasks = await this.prismaService.taskDetail.createMany({
      data: tasks,
    });

    // Notify Product Owner
    await this.pushNotificationToProductOwner(
      NotificationType.USER_CONFIRM_REQUEST,
      JSON.stringify({ id: requestId }),
      this._authService.getFullname(),
      this._authService.getUserID()
    );

    return { updatedRequest, createdTasks };
  }

  createTasks(requestId: number) {
    const tasks = [
      {
        title: 'Kiểm tra tình trạng ban đầu của sản phẩm',
        deadline: 7, // 7 days deadline
      },
      {
        title: 'Sửa chữa hoặc thay thế linh kiện bị hỏng',
        deadline: 14, // 14 days deadline
      },
      {
        title: 'Kiểm tra chất lượng sau sửa chữa',
        deadline: 21, // 21 days deadline
      }
    ];

    return tasks.map(task => ({
      requestId,
      title: task.title,
      description: '',
      status: TaskStatus.PENDING,
      deadline: this.calculateDeadline(task.deadline),
      images: [],
      comments: [],
    }));
  }

  calculateDeadline(days: number) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000); // Calculate deadline based on number of days
  }

  async updateRequestStatus(
    requestId: number,
    { status, comment, price }: UpdateRequestStatusRequest
  ) {
    const request = await this.prismaService.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }

    const updatedRequest = await this.prismaService.request.update({
      where: { id: requestId },
      data: {
        status,
        updatedBy: this._authService.getFullname(),
        updatedAt: new Date(),
        reasonReject: comment,
        price: status === RequestStatus.APPROVED ? price : request.price,
        isUserConfirm: status === RequestStatus.APPROVED ? false : request.isUserConfirm,
      },
    });

    await this.createRequestHistory(requestId, status, comment);

    switch (status) {
      case RequestStatus.REJECTED:
        await this.sendNotificationToUser(request, NotificationType.PRODUCT_OWNER_REJECT_REQUEST, { description: request.description });
        break;
      case RequestStatus.APPROVED:
        await this.sendNotificationToUser(request, NotificationType.PRODUCT_OWNER_ACCEPT_REQUEST, { price });
        break;
    }

    return updatedRequest;
  }

  async createRequestHistory(requestId: number, status: RequestStatus, comment: string | null) {
    await this.prismaService.requestHistory.create({
      data: {
        requestId,
        status,
        updatedBy: this._authService.getFullname(),
        comment,
      },
      select: { id: true },
    });
  }

  async sendNotificationToUser(request: any, notificationType: NotificationType, payload: any) {
    await this.pushNotification(
      request.userId,
      notificationType,
      JSON.stringify({ id: request.id, ...payload }),
      this._authService.getFullname(),
      this._authService.getUserID()
    );
  }
}

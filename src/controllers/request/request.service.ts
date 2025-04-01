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
    protected readonly prismaService: PrismaService) {
    super(prismaService, coreService)
  }


  async update(id: number, entity: Partial<RequestEntity>): Promise<boolean> {
    await super.update(id, entity)
    var entityUpdate = await super.getById(id);
    if (entityUpdate.status == RequestStatus.COMPLETED) {
      await this.pushNotification(entityUpdate.userId, NotificationType.DONE_REQUEST_USER,
        JSON.stringify({
          id: entityUpdate.id,
          price: entityUpdate.price
        }),
        this._authService.getFullname(), this._authService.getUserID()

      )
    }
    return true;

  }

  async add(entity: RequestEntity): Promise<number> {
    const id = await super.add(entity);

    const role = this._authService.getRole();
    if (role == Role.OWNER) {
      await this.prismaService.request.update({
        where: {
          id: id
        },
        data: {
          status: RequestStatus.IN_PROGRESS,
          isUserConfirm: true
        }
      })
      // Step 2: Tạo các TaskDetail tự động gắn với yêu cầu
      const tasks = [
        // {
        //   requestId: id,
        //   title: "Kiểm tra tình trạng ban đầu của sản phẩm",
        //   description: "",
        //   status: TaskStatus.PENDING,
        //   deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Deadline trong 7 ngày
        //   images: [],
        //   comments: [],
        // }
        // ,
        {
          requestId: id,
          title: "Sửa chữa hoặc thay thế linh kiện bị hỏng",
          description: "",
          status: TaskStatus.PENDING,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Deadline trong 14 ngày
          images: [],
          comments: [],
        },
        {
          requestId: id,
          title: "Kiểm tra chất lượng sau sửa chữa",
          description: "",
          status: TaskStatus.PENDING,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // Deadline trong 21 ngày
          images: [],
          comments: [],
        },
      ];

      // Step 3: Lưu các TaskDetail vào cơ sở dữ liệu
      const createdTasks = await this.prismaService.taskDetail.createMany({
        data: tasks,
      });
    } else {
      // push notificatio to productowner
      await this.pushNotificationToProductOnwer(NotificationType.USER_SEND_REQUEST_PRODUCT_OWNER,
        JSON.stringify({
          id
        }),
        this._authService.getFullname(), this._authService.getUserID()
      )
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
      },
    });
    // Step 2: Tạo các TaskDetail tự động gắn với yêu cầu
    const tasks = [
      // {
      //   requestId: requestId,
      //   title: "Kiểm tra tình trạng ban đầu của sản phẩm",
      //   description: "",
      //   status: TaskStatus.PENDING,
      //   deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Deadline trong 7 ngày
      //   images: [],
      //   comments: [],
      // }
      // ,
      {
        requestId: requestId,
        title: "Sửa chữa hoặc thay thế linh kiện bị hỏng",
        description: "",
        status: TaskStatus.PENDING,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Deadline trong 14 ngày
        images: [],
        comments: [],
      },
      {
        requestId: requestId,
        title: "Kiểm tra chất lượng sau sửa chữa",
        description: "",
        status: TaskStatus.PENDING,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // Deadline trong 21 ngày
        images: [],
        comments: [],
      },
    ];

    // Step 3: Lưu các TaskDetail vào cơ sở dữ liệu
    const createdTasks = await this.prismaService.taskDetail.createMany({
      data: tasks,
    });
    // Step 4: Gửi thông báo cho Product Owner
    await this.pushNotificationToProductOnwer(NotificationType.USER_CONFIRM_REQUEST,
      JSON.stringify({
        id: requestId
      }),
      this._authService.getFullname(), this._authService.getUserID()

    )
    return { updatedRequest, createdTasks };
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
        reasonReject: param.comment,
        price: param.status == RequestStatus.APPROVED ? param.price : request.price,
        isUserConfirm: param.status == RequestStatus.APPROVED ? false : request.isUserConfirm
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

    switch (param.status) {
      case RequestStatus.REJECTED:
        await this.pushNotification(request.userId, NotificationType.PRODUCT_OWNER_REJECT_REQUEST,
          JSON.stringify({
            id: request.id,
            description: request.description
          }),
          this._authService.getFullname(), this._authService.getUserID()

        )
        break;
      case RequestStatus.APPROVED:
        await this.pushNotification(request.userId, NotificationType.PRODUCT_OWNER_ACCEPT_REQUEST,
          JSON.stringify({
            id: request.id,
            price: param.price
          }),
          this._authService.getFullname(), this._authService.getUserID()

        )
        break;
    }

    // Bước 4: Trả về yêu cầu đã được cập nhật
    return updatedRequest;
  }
}

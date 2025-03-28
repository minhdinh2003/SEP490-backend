import { Injectable } from '@nestjs/common';
import { Prisma, RequestStatus, Role, TaskStatus } from '@prisma/client';
import { title } from 'process';
import { BaseService } from 'src/base/base.service';
import { NotificationType } from 'src/common/const/notification.type';
import { CoreService } from 'src/core/core.service';
import { TaskDetailEntity } from 'src/model/entity/taskDetail.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class TaskDetailService extends BaseService<TaskDetailEntity, Prisma.TaskDetailCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }


    async update(id: number, model: Partial<TaskDetailEntity>): Promise<boolean> {
        var dataOld = await super.getById(id);
        await super.update(id, model);
        var dataNew = await super.getById(id);
        if (this._authService.getRole() == Role.OWNER && dataNew.assignedTo && dataOld.assignedTo != dataNew.assignedTo) {
            await this.pushNotification(dataNew.assignedTo, NotificationType.AMIN_ASSIGN_TASK,
                JSON.stringify({
                    id: model.id,
                    title: model.title ?? dataNew.title 
                }),
                this._authService.getFullname(), this._authService.getUserID()

            )
        }
        await this.checkAndUpdateRequestStatus(dataNew.requestId);
        return true;
    }

    private async checkAndUpdateRequestStatus(requestId: number): Promise<void> {
        try {
            // Step 1: Lấy tất cả các TaskDetail liên quan đến Request
            const tasks = await this.prismaService.taskDetail.findMany({
                where: { requestId: requestId },
            });

            // Step 2: Kiểm tra xem có task nào ở trạng thái IN_PROGRESS hoặc PENDING không
            const hasPendingOrInProgressTasks = tasks.some(
                (task) => task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.CANCELLED
            );

            // Step 3: Nếu không có task nào ở trạng thái PENDING hoặc IN_PROGRESS, cập nhật trạng thái của Request
            if (!hasPendingOrInProgressTasks) {
                await this.prismaService.request.update({
                    where: { id: requestId },
                    data: {
                        status: RequestStatus.COMPLETED,
                        completedAt: new Date(),
                        updatedBy: this._authService.getFullname(),
                        updatedAt: new Date(),
                    },
                });
                var request = await this.prismaService.request.findFirst({
                    where: {
                        id: requestId
                    }
                })
                await this.pushNotificationToProductOnwer(NotificationType.DONE_REQUEST,
                    JSON.stringify({
                        id: requestId
                    }),
                    this._authService.getFullname(), this._authService.getUserID()
                )

                await this.pushNotification(request.userId, NotificationType.DONE_REQUEST_USER,
                    JSON.stringify({
                        id: requestId
                    }),
                    this._authService.getFullname(), this._authService.getUserID()
                )
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra và cập nhật trạng thái của Request:", error.message);
            throw error;
        }
    }

}

import { Injectable } from '@nestjs/common';
import { Prisma, RequestStatus, Role, TaskStatus } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { TaskTemplateEntity } from 'src/model/entity/taskTemplate.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class TaskTemplateService extends BaseService<TaskTemplateEntity, Prisma.TaskTemplateCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

}

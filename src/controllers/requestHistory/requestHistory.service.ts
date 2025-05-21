import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { RequestHistoryEntity } from 'src/model/entity/requestHistory.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class RequestHistoryService extends BaseService<RequestHistoryEntity, Prisma.RequestHistoryCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { OrderHistoryEntity } from 'src/model/entity/order.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class OrderHistoryService extends BaseService<OrderHistoryEntity, Prisma.OrderHistoryCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

}

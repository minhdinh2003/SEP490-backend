import { Inventory } from './../../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { Prisma, RequestStatus, Role, TaskStatus } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { InventoryHistoryEntity } from 'src/model/entity/inventoryHistory.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class InventoryHistoryService extends BaseService<InventoryHistoryEntity, Prisma.InventoryHistoryCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

}

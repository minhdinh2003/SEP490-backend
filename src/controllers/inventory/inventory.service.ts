import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { InventoryEntity } from 'src/model/entity/inventory.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class InventoryService extends BaseService<InventoryEntity, Prisma.InventoryCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
}

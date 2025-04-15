import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { PromotionEntity } from 'src/model/entity/promotion.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class PromotionService extends BaseService<PromotionEntity, Prisma.PromotionCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
}

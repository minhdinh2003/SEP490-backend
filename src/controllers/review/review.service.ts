import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { ReviewEntity } from 'src/model/entity/review.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class ReviewService extends BaseService<ReviewEntity, Prisma.ReviewCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
}

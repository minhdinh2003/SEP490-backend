import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { VoucherEntity } from 'src/model/entity/voucher.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class VoucherService extends BaseService<VoucherEntity, Prisma.VoucherCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
}

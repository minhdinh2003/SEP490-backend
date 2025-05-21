import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { TransactionEntity } from 'src/model/entity/transaction.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class TransactionService extends BaseService<TransactionEntity, Prisma.TransactionHistoryCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

}

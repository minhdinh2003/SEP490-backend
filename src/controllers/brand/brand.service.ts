import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { BrandEntity } from 'src/model/entity/brand.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class BrandService extends BaseService<BrandEntity, Prisma.BrandCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
}

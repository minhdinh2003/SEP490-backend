import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { ProductEntity } from 'src/model/entity/product.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class ProductService extends BaseService<ProductEntity, Prisma.ProductCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    async add(entity: ProductEntity): Promise<number> {
        var brandInfo = {
            ...entity.brandInfo
        }
        delete entity.brandInfo;
        var result = await this.repository.create(entity, {
            select: {
                id: true
            }
        }, {
            ...this.getMoreCreateData(),
            brands: {
                ...brandInfo
            }
        });
        return Number(result.id);
    }
}

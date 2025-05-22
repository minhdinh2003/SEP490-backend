import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { WhitelistEntity } from 'src/model/entity/whitelist.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class WhitelistService extends BaseService<WhitelistEntity, Prisma.WhitelistCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    async add(entity: WhitelistEntity): Promise<number> {
        entity.userId = this._authService.getUserID()
        const exist = await this.prismaService.whitelist.findFirst({
            where: {
                userId: entity.userId,
                productId: entity.productId
            }
        })
        if (exist){
            return exist.id;
        }
        var id = await super.add(entity);
        return Number(id);
    }
}

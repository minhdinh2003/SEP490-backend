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


    async update(entity: WhitelistEntity): Promise<number> {
        entity.userId = this._authService.getUserID();
    
        // Check if the entry exists
        const exist = await this.prismaService.whitelist.findFirst({
            where: {
                userId: entity.userId,
                productId: entity.productId
            }
        });
    
        // If it exists, update the existing record
        if (exist) {
            const updatedEntity = await this.prismaService.whitelist.update({
                where: { id: exist.id }, // Use the existing ID to find the record
                data: entity, // Update with the new entity data
            });
    
            return updatedEntity.id; // Return the updated entity's ID
        }
    
        // If it doesn't exist, add a new record
        const id = await super.add(entity);
        return Number(id); // Return the newly added entity's ID
    }
    
    async delete(entity: WhitelistEntity): Promise<boolean> {
        entity.userId = this._authService.getUserID();
    
        // Check if the entry exists
        const exist = await this.prismaService.whitelist.findFirst({
            where: {
                userId: entity.userId,
                productId: entity.productId
            }
        });
    
        // If the entry exists, delete it
        if (exist) {
            await this.prismaService.whitelist.delete({
                where: { id: exist.id } // Delete the record by its ID
            });
    
            return true; // Return true indicating successful deletion
        }
    
        // If the entry doesn't exist, return false
        return false; // No record was found to delete
    }
    
    async getAll(): Promise<WhitelistEntity[]> {
        const userId = this._authService.getUserID()
        return await this.prismaService.whitelist.findMany({
            where: {
                userId: userId
            }
        })
    }
    
}

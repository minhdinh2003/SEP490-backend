import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { InventoryEntity } from 'src/model/entity/inventory.entity';
import { PrismaService } from 'src/repo/prisma.service';
import { NotificationType } from 'src/common/const/notification.type';

@Injectable()
export class InventoryService extends BaseService<InventoryEntity, Prisma.InventoryCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    async importProduct(productId: number, quantity: number): Promise<boolean> {
        // Kiểm tra sản phẩm tồn tại
        const product = await this.prismaService.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Tìm hoặc tạo mới inventory record
        let inventory = await this.prismaService.inventory.findUnique({
            where: { productId }
        });

        if (!inventory) {
            inventory = await this.prismaService.inventory.create({
                data: {
                    productId,
                    quantity: 0,
                    ...this.getMoreCreateData()
                }
            });
        }

        // Cập nhật số lượng
        await this.prismaService.inventory.update({
            where: { id: inventory.id },
            data: {
                quantity: inventory.quantity + quantity,
                ...this.getMoreUpdateData()
            }
        });
        return true;
    }

    async getInventoryByProduct(productId: number): Promise<InventoryEntity> {
        const inventory = await this.prismaService.inventory.findUnique({
            where: { productId }
        });

        if (!inventory) {
            throw new Error('Inventory record not found');
        }

        return inventory;
    }

}

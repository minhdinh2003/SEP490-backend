import { Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { InventoryEntity } from 'src/model/entity/inventory.entity';
import { ProductEntity } from 'src/model/entity/product.entity';
import { AddStockRequest } from 'src/model/request/stock.request';
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
        var inventoryData = new InventoryEntity();
        inventoryData.productId = result.id;
        if (entity.category === Category.CAR) {
            inventoryData.quantity = 1;
        }
        else {
            inventoryData.quantity = 0;
        }
        var inventory = await this.prismaService.inventory.create({
            data: {
                ...inventoryData
            }
        });
        return Number(result.id);
    }

    async update(id: number, model: Partial<ProductEntity>): Promise<boolean> {
        var brandInfo = {
            ...model.brandInfo
        }
        delete model.brandInfo;
        await this.repository.update(id, {
            ...model,
            brands: {
                ...brandInfo
            }
        }, this.getMoreUpdateData());
        return true;
    }

    async addStock(body: AddStockRequest) {
        const { productId, quantity, price } = body;

        // Lấy thông tin sản phẩm và tồn kho hiện tại
        const product = await this.prismaService.product.findUnique({
            where: { id: productId },
            include: { inventory: true },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        let inventory = product.inventory;

        if (!inventory) {
            // Nếu chưa có tồn kho, tạo mới
            inventory = await this.prismaService.inventory.create({
                data: {
                    productId,
                    quantity: 0
                },
            });
        }

        // Tính giá trung bình mới
        const totalValue = product.price * inventory.quantity;
        const newTotalValue = totalValue + quantity * price;
        const newTotalQuantity = inventory.quantity + quantity;
        const newAveragePrice = Math.round(newTotalValue / newTotalQuantity);

        // Cập nhật tồn kho
        await this.prismaService.inventory.update({
            where: { id: inventory.id },
            data: {
                quantity: newTotalQuantity
            },
        });

        // Lưu lịch sử nhập kho
        await this.prismaService.product.update({
            where: { id: productId },
            data: {
                price: newAveragePrice,
            },
        });

        // Lưu lịch sử nhập kho
        const description = `Nhập ${quantity} đơn vị với giá ${price.toLocaleString()}đ. Tổng số lượng sau khi nhập: ${newTotalQuantity}`;

        await this.prismaService.inventoryHistory.create({
            data: {
                productId: productId,
                quantityChange: quantity,
                description: description
            },
        });

        return { success: true, message: "Stock added successfully" };
    }
}

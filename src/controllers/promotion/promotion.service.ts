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

    processVoucher = async function () {
        try {
            console.log('Bắt đầu kiểm tra promotion và tạo voucher...');

            const currentDate = new Date();
            const promotions = await this.prismaService.promotion.findMany({
                where: {
                    startDate: { lte: currentDate }, // startDate <= currentDate
                    endDate: { gte: currentDate }, // endDate >= currentDate
                },
            });

            for (const promotion of promotions) {

                // Step 2: Lấy danh sách order có trạng thái "đã hoàn thành" hoặc "đã thanh toán" trong khoảng thời gian
                const orders = await this.prismaService.order.findMany({
                    where: {
                        createdAt: { gte: promotion.startDate, lte: promotion.endDate },
                        status: { in: ['DELIVERED', 'SHIPPED'] }, 
                    },
                    select: {
                        userId: true, 
                    },
                });

                const userIds = Array.from(new Set(orders.map((order) => order.userId)));

                for (const userId of userIds) {
                    const userOrders = await this.prismaService.order.count({
                        where: {
                            userId: userId,
                            createdAt: { gte: promotion.startDate, lte: promotion.endDate },
                            status: { in: ['COMPLETED', 'PAID'] },
                        },
                    });
                    const existingVoucher = await this.prismaService.voucher.findFirst({
                        where: {
                            promotionId: promotion.id
                        },
                    });

                    if (existingVoucher) {
                        console.log(`User ID ${userId} đã có voucher cho promotion ID ${promotion.id}. Bỏ qua.`);
                        continue; 
                    }

                    
                    if (userOrders >= promotion.times) {
                        const voucherCode = this.generateVoucherCode();

                        const voucher = await this.prismaService.voucher.create({
                            data: {
                                code: voucherCode,
                                promotionId: promotion.id,
                                discount: promotion.discount,
                                usageLimit: 1, 
                                usedCount: 0,
                                startDate: new Date(), 
                                expiryDate: promotion.endDate, 
                                createdBy: `User-${userId}`,
                            },
                        });

                        console.log(`Voucher đã được tạo cho user ID ${userId}:`, voucher);
                    }
                }
            }

            console.log('Hoàn thành kiểm tra promotion và tạo voucher.');
        } catch (error) {
            console.error('Lỗi khi xử lý promotion và tạo voucher:', error.message);
        }
    }
    generateVoucherCode = (): string => {
        return `VOUCHER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }
}

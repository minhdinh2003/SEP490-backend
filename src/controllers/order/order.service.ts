import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { OrderEntity } from 'src/model/entity/order.entity';
import { OrderItemRequest } from 'src/model/request/orderItem.request';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class OrderService extends BaseService<OrderEntity, Prisma.OrderCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    createOrder = async ( orderItems: OrderItemRequest[])  => {
        var userId = this._authService.getUserID();
        try {
            // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
            const order = await this.prismaService.$transaction(async (prisma) => {
                // Step 1: Kiểm tra số lượng sản phẩm trong kho
                for (const item of orderItems) {
                    const inventory = await prisma.inventory.findUnique({
                        where: { productId: item.productId },
                    });

                    if (!inventory || inventory.quantity < item.quantity) {
                        throw new Error(`Sản phẩm với ID ${item.productId} không đủ số lượng trong kho.`);
                    }
                }

                // Step 2: Tính tổng số tiền của đơn hàng
                const products = await prisma.product.findMany({
                    where: { id: { in: orderItems.map((item) => item.productId) } },
                    select: { id: true, price: true },
                });

                const totalAmount = orderItems.reduce((total, item) => {
                    const product = products.find((p) => p.id === item.productId);
                    return total + parseInt(product.price.toString()) * item.quantity;
                }, 0);

                // Step 3: Tạo đơn hàng
                const newOrder = await prisma.order.create({
                    data: {
                        userId,
                        totalAmount,
                        status: 'PENDING',
                        orderItems: {
                            create: orderItems.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: products.find((p) => p.id === item.productId)?.price || 0,
                            })),
                        },
                    },
                });

                // Step 4: Cập nhật số lượng sản phẩm trong kho
                for (const item of orderItems) {
                    await prisma.inventory.update({
                        where: { productId: item.productId },
                        data: { quantity: { decrement: item.quantity } },
                    });
                }

                return newOrder;
            });

            console.log('Đơn hàng đã được tạo thành công:', order);
            return order;
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error.message);
            throw error;
        }
    }
    updateStatus = async (orderId: number, status: OrderStatus) => 
    {

    }
}

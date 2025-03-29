import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { OrderEntity } from 'src/model/entity/order.entity';
import { CreateOrderRequest, OrderItemRequest } from 'src/model/request/orderItem.request';
import { PrismaService } from 'src/repo/prisma.service';
import { PayOSService } from 'src/common/services/payos/PayOS.service' ;
import { DepositRequest } from 'src/model/request/deposit.request';
import { OrderInfo } from 'src/model/enum/order.enum';
import { PaymentMethod } from 'src/model/enum/payment.enum';

@Injectable()
export class OrderService extends BaseService<OrderEntity, Prisma.OrderCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService,
        protected readonly payosService: PayOSService 
    ) {
        super(prismaService, coreService)
    }

    createOrder = async ( request: CreateOrderRequest)  => {
        var orderItems = request.orderItems;
        var userId = this._authService.getUserID();
        try {
            let paymentMethod = request.orderItems[0].paymentMethod;
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
                        status: paymentMethod == PaymentMethod.BankOnline ?  'PENDING' : 'PROCESSING',
                        fullName: request.fullName,
                        address: request.address,
                        phoneNumber: request.phoneNumber,
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
            if (paymentMethod == PaymentMethod.BankOnline){
                var deposit = new DepositRequest();
                deposit.amount = parseInt(order.totalAmount.toString());
                return this.payosService.payOrder(deposit, order)
            }else {
                return process.env.LinkPayCoinSuccess;
            }
            
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error.message);
            throw error;
        }
    }
    updateStatus = async (orderId: number, status: OrderStatus) => {
        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        const result = await this.prismaService.$transaction(async (prisma) => {
            // Step 1: Cập nhật trạng thái của đơn hàng
            const updatedOrder = await prisma.order.update({
                where: { id: orderId},
                data: {
                    status: status,
                    updatedAt: new Date(),
                },
            });

            // Step 2: Thêm bản ghi vào bảng OrderHistory
            const orderHistory = await prisma.orderHistory.create({
                data: {
                    orderId: orderId,
                    status: status,
                    updatedById: this._authService.getUserID(),
                    updatedAt: new Date(),
                },
            });

            return { updatedOrder, orderHistory };
        });
        return result;
    }

    async processCallback(request: any){
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }

    async processCancelURL(request: any){
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }

    async processReturnURL(request: any){
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }
}

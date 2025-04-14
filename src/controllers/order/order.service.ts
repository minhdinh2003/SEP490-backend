import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, PromotionType } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { OrderEntity } from 'src/model/entity/order.entity';
import { CreateOrderRequest, CreateOrderRequestRepair, OrderItemRequest } from 'src/model/request/orderItem.request';
import { PrismaService } from 'src/repo/prisma.service';
import { PayOSService } from 'src/common/services/payos/PayOS.service';
import { DepositRequest } from 'src/model/request/deposit.request';
import { OrderInfo } from 'src/model/enum/order.enum';
import { PaymentMethod } from 'src/model/enum/payment.enum';
import { NotificationType } from 'src/common/const/notification.type';

@Injectable()
export class OrderService extends BaseService<OrderEntity, Prisma.OrderCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService,
        protected readonly payosService: PayOSService
    ) {
        super(prismaService, coreService)
    }

    createOrder = async (request: CreateOrderRequest) => {
        var orderItems = request.orderItems;
        var userId = this._authService.getUserID();
        try {
            let discountInfo = null;
            if (request.voucherCode) {
                // Gọi hàm apply để kiểm tra và áp dụng mã voucher
                discountInfo = await this.apply(request.voucherCode, orderItems[0].productId, orderItems[0].quantity);
            }
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

                let totalAmount = orderItems.reduce((total, item) => {
                    const product = products.find((p) => p.id === item.productId);
                    return total + parseInt(product.price.toString()) * item.quantity;
                }, 0);


                if (request.voucherCode) {
                    totalAmount = discountInfo.discountedPrice;
                    // Gọi hàm apply để kiểm tra và áp dụng mã voucher
                    discountInfo = await this.apply(request.voucherCode, orderItems[0].productId, orderItems[0].quantity);
                    await prisma.voucher.update({
                        where: { code: request.voucherCode }, // Tìm voucher dựa trên mã
                        data: { usedCount: { increment: 1 } }, // Tăng usedCount lên 1
                    });
                }

                // Step 3: Tạo đơn hàng
                const newOrder = await prisma.order.create({
                    data: {
                        userId,
                        totalAmount,
                        status: paymentMethod == PaymentMethod.BankOnline ? 'PENDING' : 'PROCESSING',
                        fullName: request.fullName,
                        address: request.address,
                        phoneNumber: request.phoneNumber,
                        voucherCode: request.voucherCode,
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
            if (paymentMethod == PaymentMethod.BankOnline) {
                var deposit = new DepositRequest();
                deposit.amount = parseInt(order.totalAmount.toString());
                // get link thanh toán
                return this.payosService.payOrder(deposit, order)
            } else {
                return process.env.LinkPayCoinSuccess;
            }

        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error.message);
            throw error;
        }
    }

    createOrderRepair = async (request: CreateOrderRequestRepair) => {
        var userId = this._authService.getUserID();
        try {
            let paymentMethod = request.paymentMethod;
            const data = await this.prismaService.request.findFirst({
                where: {
                    id: request.requestId
                }
            })
            const order = await this.prismaService.$transaction(async (prisma) => {

                const newOrder = await prisma.order.create({
                    data: {
                        totalAmount: data.price,
                        status: paymentMethod == PaymentMethod.BankOnline ? 'PENDING' : 'PROCESSING',
                        fullName: request.fullName,
                        address: request.address,
                        phoneNumber: request.phoneNumber,
                        isRepair: true,
                        user: {
                            connect: { id: userId }
                        },
                        Request: {
                            connect: { id: request.requestId }
                        }
                    },
                });

                return newOrder;
            });
            if (paymentMethod == PaymentMethod.BankOnline) {
                return this.payosService.payOrderRequest(request.requestId, parseInt(order.totalAmount.toString()), order)
            } else {
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
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    orderItems: {
                        include: { product: true },
                    }, user: true
                },
            });
            // Step 1: Cập nhật trạng thái của đơn hàng
            const updatedOrder = await prisma.order.update({
                where: { id: orderId },
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
            if (status === OrderStatus.SHIPPED && order.paymentMethod == PaymentMethod.BankOnline) {
                const paymentDate = new Date();
                if (!order) {
                    throw new Error("Không tìm thấy đơn hàng.");
                }

                const userId = order.userId;
                let type: any = PromotionType.DISCOUNT; // Mặc định là DISCOUNT
                if (order.isRepair) {
                    type = PromotionType.MAINTENANCE;
                }

                const validPromotions = await prisma.promotion.findMany({
                    where: {
                        type: type, // Chỉ lấy các chương trình giảm giá
                        startDate: { lte: paymentDate }, // startDate <= paymentDate
                        endDate: { gte: paymentDate }, // endDate >= paymentDate
                        voucherUsed: { lt: prisma.promotion.fields.voucherQuantity }, // Chưa vượt quá số lượng voucher
                        OR: [
                            {
                                type: PromotionType.DISCOUNT,
                                minUseAmount: { lte: parseInt(order.totalAmount + "") },
                            },
                        ],
                    },
                    orderBy: {
                        discountValue: "desc", // Sắp xếp giảm giá từ cao đến thấp
                    },
                });

                // Sinh voucher cho khách hàng nếu có mã giảm giá hợp lệ
                if (validPromotions.length > 0) {
                    const highestDiscountPromotion = validPromotions[0]; // Lấy chương trình giảm giá cao nhất

                    // Tạo voucher mới cho khách hàng
                    await prisma.voucher.create({
                        data: {
                            promotionId: highestDiscountPromotion.id,
                            userId: userId,
                            code: `VOUCHER-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Mã voucher duy nhất
                            discount: highestDiscountPromotion.discountValue,
                            usageLimit: 1, // Số lượt sử dụng tối đa
                            validFrom: highestDiscountPromotion.startDate,
                            validTo: highestDiscountPromotion.endDate,
                        },
                    });

                    // Cập nhật số lượng voucher đã sử dụng trong bảng Promotion
                    await prisma.promotion.update({
                        where: { id: highestDiscountPromotion.id },
                        data: {
                            voucherUsed: { increment: 1 }, // Tăng số lượng đã sử dụng lên 1
                        },
                    });

                    await this.pushNotification(userId, NotificationType.SEND_VOUCHER_CUSTOMER,
                        JSON.stringify({
                            id: orderId,

                        }),
                        this._authService.getFullname(), this._authService.getUserID()
                    )
                }
            }
            if (status === OrderStatus.CANCELLED) {
                const orderItems = await this.prismaService.orderItem.findMany({
                    where: {
                        orderId: order.id
                    },
                    select: {
                        id: true,
                        productId: true,
                        quantity: true
                    }
                })
                for (var item of orderItems) {
                    var inventory = await this.prismaService.inventory.findUnique({
                        where: {
                            productId: item.productId
                        }
                    })
                    inventory.quantity += item.quantity;
                    await this.prismaService.inventory.update({
                        where: {
                            id: inventory.id
                        },
                        data: {
                            ...inventory
                        }
                    })

                }
                await this.prismaService.transactionHistory.create({
                    data: {
                        userId: order.userId,
                        object: "Bank",// type coin
                        description: `Hủy đơn hàng ${order.id}: với số tiền: ${this.formatVND(order.totalAmount)}`,
                        paymentMethod: PaymentMethod.BankOnline, //
                        orderId: order.id,
                    }
                });
                // Hoàn tiền cho khách hàng
                if (order.paymentMethod == PaymentMethod.BankOnline && order.status == OrderStatus.PROCESSING) {
                    await this._emailService.sendEmail(order.user.email, "Hệ thống hoàn tiền khi hủy đơn hàng", "TemplateRefund.html", {
                        customerName: order.user.fullName,
                        orderName: order.orderItems[0].product.name,
                        quantity: 1,
                        refundAmount: this.formatVND(order.totalAmount),
                    })
                }
            }

            return { updatedOrder, orderHistory };
        });
        return result;
    }
    private formatVND(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    async processCallback(request: any) {
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }

    async processCancelURL(request: any) {
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }

    async processReturnURL(request: any) {
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }

    async processCancelURLRequest(request: any) {
        return await this.payosService.processReturnURL(request, OrderInfo.Request);
    }

    async processReturnURLRequest(request: any) {
        return await this.payosService.processReturnURL(request, OrderInfo.Payment);
    }

    async apply(voucherCode: string, productId: number, quantity: number) {
        try {
            const userId = this._authService.getUserID();
            // Step 1: Tìm kiếm voucher dựa trên mã voucher
            const voucher = await this.prismaService.voucher.findFirst({
                where: {
                    code: voucherCode,
                    validFrom: { lte: new Date() }, // Ngày bắt đầu <= ngày hiện tại
                    validTo: { gte: new Date() }, // Ngày kết thúc >= ngày hiện tại
                    usedCount: 0,
                    userId: userId
                },
                include: {
                    promotion: true, // Bao gồm thông tin về chương trình khuyến mãi liên quan
                },
            });

            if (!voucher) {
                throw new Error("Mã voucher không hợp lệ hoặc đã hết hạn.");
            }

            // Step 2: Kiểm tra xem voucher có áp dụng được cho người dùng này không
            if (voucher.userId && voucher.userId !== userId) {
                throw new Error("Mã voucher này không được áp dụng cho bạn.");
            }

            // Step 3: Lấy giá sản phẩm
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
                select: { price: true },
            });

            if (!product) {
                throw new Error("Không tìm thấy sản phẩm.");
            }

            const totalPrice = product.price * quantity;

            // Step 4: Tính toán số tiền sau khi giảm giá
            let discountedPrice = totalPrice;
            const discountValue = voucher.promotion.discountValue;

            if (voucher.promotion.discountType === "PERCENTAGE") {
                discountedPrice -= (totalPrice * Number(discountValue)) / 100;
            } else if (voucher.promotion.discountType === "AMOUNT") {
                discountedPrice -= Number(discountValue);
            }

            // Đảm bảo giá sau giảm không âm
            discountedPrice = Math.max(discountedPrice, 0);

            // Step 5: Trả về kết quả
            return {
                voucherCode: voucher.code,
                originalPrice: totalPrice,
                discountedPrice: discountedPrice,
                discountValue: discountValue,
                discountType: voucher.promotion.discountType,
            };
        } catch (error) {
            throw new Error(`Lỗi khi áp dụng voucher: ${error.message}`);
        }
    }

}

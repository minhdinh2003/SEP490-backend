import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/repo/prisma.service';
import { CoreService } from 'src/core/core.service';
import { ReturnURLRequest } from 'src/model/request/return.request';
import { DepositRequest } from 'src/model/request/deposit.request';
import { OrderInfo } from 'src/model/enum/order.enum';
import { PaymentMethod } from 'src/model/enum/payment.enum';
import { OrderItemEntity } from 'src/model/entity/order.entity';
import { OrderStatus } from '@prisma/client';
const PayOS = require("@payos/node");


@Injectable()
export class PayOSService {
    private PAYOS_CLIENT_ID: string = "";
    private PAYOS_API_KEY: string = "";
    private PAYOS_CHECKSUM: string = "";
    private PAYOS_CALLBACKURL: string = "";
    private LinkPayFail: string = "";
    private LinkPayCoinSuccess: string = "";
    private LinkPayCancel: string = "";
    constructor(
        protected readonly coreService: CoreService,
        protected readonly prismaService: PrismaService
    ) {
        this.PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
        this.PAYOS_API_KEY = process.env.PAYOS_API_KEY;
        this.PAYOS_CHECKSUM = process.env.PAYOS_CHECKSUM;
        this.PAYOS_CALLBACKURL = process.env.PAYOS_CALLBACKURL;
        this.LinkPayFail = process.env.LinkPayFail;
        this.LinkPayCoinSuccess = process.env.LinkPayCoinSuccess;
        this.LinkPayCancel = process.env.LinkCancel;
    }
    async payOrder(request: DepositRequest, order: any): Promise<string> {
        const dataOrder = {
            id: order.id,
            userId: order.userId,
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount
        }
        const id = await this.createTransaction(JSON.stringify(dataOrder));
        return this.doPayment({
            orderCode: id,
            amount: (request.amount),
            name: "Thanh toán tiền",
            cancelUrl: this.getCancelURLCallBack(OrderInfo.Payment),
            returnUrl: this.getReturnURLCallBack(OrderInfo.Payment)
        });
    }

    async payOrderRequest(requestId, amount, order: any): Promise<string> {
        const dataOrder = {
            id: order.id,
            requestId: requestId,
            userId: order.userId,
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount
        }
        const id = await this.createTransaction(JSON.stringify(dataOrder));
        return this.doPayment({
            orderCode: id,
            amount: (amount),
            name: "Thanh toán tiền",
            cancelUrl: this.getCancelURLCallBack(OrderInfo.Request),
            returnUrl: this.getReturnURLCallBack(OrderInfo.Request)
        });
    }

    private async doPayment({ name = "", desciption = '', amount = 0, orderCode, cancelUrl, returnUrl }): Promise<string> {
        const payos = new PayOS(this.PAYOS_CLIENT_ID, this.PAYOS_API_KEY, this.PAYOS_CHECKSUM);
        const requestData = {
            orderCode: orderCode,
            amount: amount,
            description: name || "Thanh toan don hang",
            cancelUrl: cancelUrl,
            returnUrl: returnUrl,
        };
        const paymentLink = await payos.createPaymentLink(requestData);
        return paymentLink.checkoutUrl;
    }

    async processReturnURL(query: Record<string, string>, orderType: string): Promise<string> {
        var returnRequest = new ReturnURLRequest();
        for (const [key, value] of Object.entries(query)) {
            if (Reflect.has(returnRequest, key)) {
                Reflect.set(returnRequest, key, value);
            }
        }
        return await this.handlePaymentBasedOnType(orderType, returnRequest);
    }

    private async handlePaymentBasedOnType(orderType: string, returnRequest: ReturnURLRequest): Promise<string | null> {
        switch (orderType) {
            case OrderInfo.Payment:
                const linkProcess = await this.payment(returnRequest);
                return !linkProcess ? this.LinkPayCoinSuccess : linkProcess;
            case OrderInfo.Request:
                const linkProcess1 = await this.paymentRequest(returnRequest);
                return !linkProcess1 ? this.LinkPayCoinSuccess : linkProcess1;
            default:
                return this.LinkPayFail;
        }
    }
    private formatVND(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    private async payment(returnRequest: ReturnURLRequest): Promise<string> {
        const transactionID = parseInt(returnRequest.orderCode);
        const transaction = await this.prismaService.transaction.findUnique({
            where: { id: transactionID },
        });
        if (!transaction) return this.LinkPayFail;
        const order = JSON.parse(transaction.infor);
        var orderInfo = await this.prismaService.order.findUnique({
            where: {
                id: order.id
            }
        });
        if (!orderInfo) {
            throw new Error(`Thông tin đơn hàng không tồn tại`);
        }
        if (returnRequest.cancel == 'true') {
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
                    description: `Hủy đơn hàng ${transactionID}: với số tiền: ${this.formatVND(order.totalAmount)}`,
                    paymentMethod: PaymentMethod.BankOnline, //
                    orderId: transactionID
                }
            });
            await this.updateStatus(order.id, OrderStatus.CANCELLED, order.userId);
            return this.LinkPayCancel;
        }
        var orderProccessed = await this.prismaService.transactionHistory.findMany({
            where: {
                orderId: transactionID
            }
        });
        if (orderProccessed != null && orderProccessed.length > 0) {
            // đơn hàng đã xử lý cộng tiền rồi
            return this.LinkPayCoinSuccess;
        }
        await this.prismaService.transactionHistory.create({
            data: {
                userId: order.userId,
                object: "Bank",// type coin
                description: `Đơn hàng ${transactionID}: thanh toán thành công với số tiền: ${this.formatVND(order.totalAmount)}`,
                paymentMethod: PaymentMethod.BankOnline, //
                orderId: transactionID
            }
        });
        await this.updateStatus(order.id, OrderStatus.PROCESSING, order.userId);

        return this.LinkPayCoinSuccess;
    }
    private async paymentRequest(returnRequest: ReturnURLRequest): Promise<string> {
        const transactionID = parseInt(returnRequest.orderCode);
        const transaction = await this.prismaService.transaction.findUnique({
            where: { id: transactionID },
        });
        if (!transaction) return this.LinkPayFail;
        const order = JSON.parse(transaction.infor);
        var orderInfo = await this.prismaService.order.findUnique({
            where: {
                id: order.id
            }
        });
        if (!orderInfo) {
            throw new Error(`Thông tin đơn hàng không tồn tại`);
        }
        if (returnRequest.cancel == 'true') {
            await this.prismaService.transactionHistory.create({
                data: {
                    userId: order.userId,
                    object: "Bank",// type coin
                    description: `Hủy đơn hàng sửa chữa ${transactionID}: với số tiền: ${this.formatVND(order.totalAmount)}`,
                    paymentMethod: PaymentMethod.BankOnline, //
                    orderId: transactionID
                }
            });
            await this.updateStatus(order.id, OrderStatus.CANCELLED, order.userId);
            return this.LinkPayCancel;
        }
        await this.prismaService.request.update({
            where: {
                id: order.requestId
            },
            data: {
                updatedAt: new Date(),
                isPay: true
            }
        })
        var orderProccessed = await this.prismaService.transactionHistory.findMany({
            where: {
                orderId: transactionID
            }
        });
        if (orderProccessed != null && orderProccessed.length > 0) {
            // đơn hàng đã xử lý cộng tiền rồi
            return this.LinkPayCoinSuccess;
        }
        await this.prismaService.transactionHistory.create({
            data: {
                userId: order.userId,
                object: "Bank",// type coin
                description: `Đơn hàng ${transactionID}: thanh toán thành công với số tiền: ${this.formatVND(order.totalAmount)}`,
                paymentMethod: PaymentMethod.BankOnline, //
                orderId: transactionID
            }
        });
        await this.updateStatus(order.id, OrderStatus.PROCESSING, order.userId);

        return this.LinkPayCoinSuccess;
    }


    private async createTransaction(rawData: string): Promise<number> {
        const transaction = await this.prismaService.transaction.create({
            data: {
                infor: rawData,
                id: this.generateRandomNumber(),
                orderId: -1
            }
        });
        return transaction.id;
    }

    private generateRandomNumber(): number {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;  // Đảm bảo luôn có 6 chữ số
        return randomNumber;
    }

    private getReturnURLCallBack(type): string {
        switch (type) {
            case OrderInfo.Payment:
                return `${this.PAYOS_CALLBACKURL}/order/returnurl`;
            case OrderInfo.Request:
                return `${this.PAYOS_CALLBACKURL}/order/returnurlrequest`;
        }
    }
    private getCancelURLCallBack(type): string {
        switch (type) {
            case OrderInfo.Payment:
                return `${this.PAYOS_CALLBACKURL}/order/cancelurl`;
            case OrderInfo.Request:
                return `${this.PAYOS_CALLBACKURL}/order/returnurlrequest`;
        }
    }

    private async updateStatus(orderId: number, status: OrderStatus, userId: number) {
        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        const result = await this.prismaService.$transaction(async (prisma) => {
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
                    updatedById: userId,
                    updatedAt: new Date(),
                },
            });

            return { updatedOrder, orderHistory };
        });
        return result;
    }


}



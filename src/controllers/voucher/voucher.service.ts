import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { VoucherEntity } from 'src/model/entity/voucher.entity';
import { PrismaService } from 'src/repo/prisma.service';

@Injectable()
export class VoucherService extends BaseService<VoucherEntity, Prisma.VoucherCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
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

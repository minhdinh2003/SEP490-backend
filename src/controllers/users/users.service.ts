import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, Role } from '@prisma/client';
import { hash } from 'bcrypt'
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { UserDetail } from 'src/model/dto/user.dto';
import { UserEntity } from 'src/model/entity/user.entity';
import { PageRequest } from 'src/model/request/page.request';
import { ServiceResponse } from 'src/model/response/service.response';
import { PrismaService } from 'src/repo/prisma.service';
import { generateRandomPassword, isEnvDevelopment } from 'src/utils/common.utils';

@Injectable()
export class UsersService extends BaseService<UserEntity, Prisma.UserCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }

    async confirmUser (id: number): Promise<boolean>  {
        const user = await this.prismaService.userRepo.findOneWithCondition({ id: id });
        if (!user) {
            throw new HttpException({ message: 'User not exist' }, HttpStatus.BAD_REQUEST);
        }
        await this.prismaService.user.update({
            where: { id: id },
            data: { isConfirm: true },
        });
        return true;
    }
    //
    async add(entity: UserEntity): Promise<number> {
        const user = await this.prismaService.userRepo.findByEmail(entity.email)
        if (user) {
            throw new HttpException({ message: 'Email đã tồn tại' }, HttpStatus.BAD_REQUEST)
        }
        let passWord = generateRandomPassword(10);
        //if (isEnvDevelopment()) {
        passWord = "12345678";
        //}
        entity.passwordHash = await hash(passWord, 10);
        var result = await this.repository.create(entity, {
            select: {
                id: true
            }
        }, this.getMoreCreateData());
        await this._emailService.sendEmail(entity.email, "Quản trị đã tạo tài khoản cho bạn", "AdminCreateAccountForStudent.html", {
            userName: entity.email,
            passWord: passWord,
            confirmLink: process.env.CONFIRM_USER + result.id,
        })
        return Number(result.id);
    }

    async update(id: number, model: Partial<UserEntity>): Promise<boolean> {
        var user = await this.prismaService.userRepo.findOneWithCondition({
            id: {
                not: id
            },
            email: model.email
        })
        if (user) {
            throw new HttpException({ message: 'Email đã tồn tại' }, HttpStatus.BAD_REQUEST)
        }
        await this.repository.update(id, model, this.getMoreUpdateData());
        return true;
    }

    async getCurrentUser(): Promise<ServiceResponse> {
        var userCurrent = await this.getOneAndReference({
            id: this._authService.getUserID()
        });
        if (!userCurrent) {
            throw new HttpException({ message: 'User not exist' }, HttpStatus.BAD_REQUEST);
        }
        const result = this._mapperService.mapData(userCurrent, UserEntity, UserDetail);
        return ServiceResponse.onSuccess(result);
    }

    async getNotification(param: PageRequest) {
        return this.prismaService.notificationRepo.getPaging(param, false);
    }

    async updateViewNotification(id: number) {
        await this.prismaService.notification.update({
            where: {
                id: id
            },
            data: {
                isViewed: true
            }
        })
        return true;
    }
    generateReport = async (startDate: string, endDate: string) => {
        const fromDate = new Date(startDate);
        const toDate = new Date(endDate);

        try {
            // 1. Tổng doanh thu
            const totalRevenue = await this.prismaService.order.aggregate({
                where: {
                    createdAt: { gte: fromDate, lte: toDate },
                    status: OrderStatus.SHIPPED,
                },
                _sum: { totalAmount: true },
            });

            // 2. Số người đăng ký
            const totalRegistrations = await this.prismaService.user.count({
                where: {
                    createdAt: { gte: fromDate, lte: toDate },
                },
            });

            // 3. Lấy tất cả đơn hàng trong khoảng thời gian
            const allOrders = await this.prismaService.order.findMany({
                where: {
                    createdAt: { gte: fromDate, lte: toDate },
                    status: OrderStatus.SHIPPED,
                },
                select: {
                    createdAt: true,
                    totalAmount: true,
                },
            });

            // Nhóm dữ liệu theo tháng/năm
            const revenueByMonth = allOrders.reduce((acc, order) => {
                const monthYear = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[monthYear]) {
                    acc[monthYear] = { month: monthYear, revenue: 0 };
                }
                acc[monthYear].revenue += parseInt(order.totalAmount + "");
                return acc;
            }, {} as Record<string, { month: string; revenue: number }>);

            // Tạo danh sách tất cả các tháng từ fromDate đến toDate
            const allMonthsInRange: { month: string; revenue: number }[] = [];
            let currentDate = new Date(fromDate);
            while (currentDate <= toDate) {
                const monthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                allMonthsInRange.push({ month: monthYear, revenue: revenueByMonth[monthYear]?.revenue || 0 });
                currentDate.setMonth(currentDate.getMonth() + 1); // Tăng lên tháng tiếp theo
            }
            // Đếm số lượng đơn hàng theo trạng thái
            const orderStatusCounts = await this.prismaService.order.groupBy({
                by: ['status'],
                where: {
                    createdAt: { gte: fromDate, lte: toDate },
                },
                _count: true,
            });

            // Format dữ liệu để phù hợp với PieChart
            const formattedOrderStatusCounts = orderStatusCounts.map((item) => ({
                status: item.status, // Trạng thái đơn hàng
                count: item._count, // Số lượng đơn hàng
            }));


            // Trả về kết quả báo cáo
            return {
                totalRevenue: totalRevenue._sum.totalAmount || 0,
                totalRegistrations: totalRegistrations,
                revenueByMonth: allMonthsInRange, // Dữ liệu cho biểu đồ cột
                orderStatusCounts: formattedOrderStatusCounts
            };
        } catch (error) {
            console.error("Lỗi khi tạo báo cáo:", error);
            throw error;
        }
    };


}

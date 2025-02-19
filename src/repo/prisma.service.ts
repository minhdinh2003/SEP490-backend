// core/services/unit-of-work.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { OtpRequest, PrismaClient, Prisma } from '@prisma/client';
import { UserRepository } from './user.repo';
import { BaseRepository } from './base.repo';
import { Notification } from 'src/model/entity/notification.entity';



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  public userRepo: UserRepository;
  public otpRepo: BaseRepository<OtpRequest, Prisma.OtpRequestCreateInput>;
  constructor() {
    super();
    this.userRepo = new UserRepository(this);
    this.otpRepo = new BaseRepository<OtpRequest, Prisma.OtpRequestCreateInput>(this, this.otpRequest);
  }

  // Đóng kết nối Prisma khi module bị hủy
  async onModuleDestroy() {
    await this.$disconnect();
  }

  createRepo<T extends { id: number }, K>(modelName, model: any) {
    switch (modelName) {
      case "users":
        return this.userRepo;
      // case "optRequest":
      //   return this.otpRepo;
    }
    return new BaseRepository<T, K>(this, model);
  }

  getModelByType<T>(type: string): any {
    switch (type) {
      case "users":
        return this.user;
      case "optRequest":
        return this.otpRequest;
      case "brand":
        return this.brand;
      case "product":
        return this.product;
      case "inventory":
        return this.inventory;
      case "whitelist":
        return this.whitelist;
      case "review":
        return this.review;
      case "order":
        return this.order;
      case "orderItem":
        return this.orderItem;
      case "orderHistory":
        return this.orderHistory;
    }
    return null;
  }

}

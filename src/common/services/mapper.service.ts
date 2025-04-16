import { User } from '@prisma/client';
// user.profile.ts
import { createMap, forMember, ignore, mapFrom, createMapper } from '@automapper/core';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/model/entity/user.entity';
import { RegisterDto } from '../../model/dto/auth.dto';
import { classes } from '@automapper/classes';
import { RegisterResponse } from 'src/model/response/register.response';
import { UserDetail, UserDto } from 'src/model/dto/user.dto';
import { NotificationDto } from 'src/model/dto/notification.dto';
import { Notification } from 'src/model/entity/notification.entity';
import { BrandDto } from 'src/model/dto/brand.dto';
import { BrandEntity } from 'src/model/entity/brand.entity';
import { ProductDto } from 'src/model/dto/product.dto';
import { ProductEntity } from 'src/model/entity/product.entity';
import { InventoryEntity } from 'src/model/entity/inventory.entity';
import { InventoryDto } from 'src/model/dto/inventory.dto';
import { WhitelistEntity } from 'src/model/entity/whitelist.entity';
import { WhitelistDto } from 'src/model/dto/whitelist.dto';
import { ReviewDto } from 'src/model/dto/review.dto';
import { ReviewEntity } from 'src/model/entity/review.entity';
import { OrderDto, OrderHistoryDto, OrderItemDto } from 'src/model/dto/order.dto';
import { OrderEntity, OrderHistoryEntity, OrderItemEntity } from 'src/model/entity/order.entity';
import { PromotionDto } from 'src/model/dto/promotion.dto';
import { PromotionEntity } from 'src/model/entity/promotion.entity';
import { VoucherDto } from 'src/model/dto/voucher.dto';
import { VoucherEntity } from 'src/model/entity/voucher.entity';
import { TransactionDto } from 'src/model/dto/transaction.dto';
import { TransactionEntity } from 'src/model/entity/transaction.entity';
import { RequestDto } from 'src/model/dto/request.dto';
import { RequestEntity } from 'src/model/entity/request.entity';
import { RequestHistoryDto } from 'src/model/dto/requestHistory.dto';
import { RequestHistoryEntity } from 'src/model/entity/requestHistory.entity';
import { ChatEntity } from 'src/model/entity/chat.entity';
import { ChatDto } from 'src/model/dto/chat.dto';
import { TaskDetailEntity } from 'src/model/entity/taskDetail.entity';
import { TaskDetailDto } from 'src/model/dto/taskDetail.dto';

@Injectable()
export class MapperService {
  private readonly mapper: Mapper;
  constructor() {
    // Khởi tạo mapper với chiến lược classes
    this.mapper = createMapper({
      strategyInitializer: classes(),
    });

    // Cấu hình các map giữa các lớp
    this.initializeMappings();
  }

  private initializeMappings() {
    createMap(
      this.mapper,
      RegisterDto,
      UserEntity,
      forMember((dest) => dest.id, ignore()), // Bỏ qua id vì DTO không chứa id
      forMember((dest) => dest.passwordHash, ignore()), // Mã hóa mật khẩu sau
      forMember((dest) => dest.createdAt, mapFrom(() => new Date())), // Set thời gian hiện tại cho createdAt
      forMember((dest) => dest.updatedAt, mapFrom(() => new Date())) // Set thời gian hiện tại cho updatedAt
    );
    createMap(this.mapper, UserEntity, RegisterResponse);
    createMap(this.mapper, UserEntity, UserDto,
      forMember((dest) => dest.gender, mapFrom((src) => src.gender)),
      forMember((dest) => dest.role, mapFrom((src) => src.role)),
      forMember((dest) => dest.id, mapFrom((src) => src.id)),
      forMember((dest) => dest.isConfirm, mapFrom((src) => src.isConfirm))
    );
    createMap(this.mapper, UserDto, UserEntity);

    createMap(this.mapper, UserEntity, UserDetail,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.role,
        mapFrom((src) => src.role)
      ),
      forMember(
        (dest) => dest.gender,
        mapFrom((src) => src.gender)
      ),
    );
    createMap(this.mapper, Notification, NotificationDto,
      forMember((dest) => dest.createdAt, mapFrom((src) => src.createdAt))
    );
    createMap(this.mapper, NotificationDto, Notification);
    createMap(this.mapper, BrandDto, BrandEntity);
    createMap(this.mapper, BrandEntity, BrandDto);
    createMap(this.mapper, ProductDto, ProductEntity);
    createMap(this.mapper, ProductEntity, ProductDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.price,
        mapFrom((src) => src.price)
      ),
      forMember(
        (dest) => dest.year,
        mapFrom((src) => src.year)
      ),
      forMember(
        (dest) => dest.mileage,
        mapFrom((src) => src.mileage)
      ),
      forMember(
        (dest) => dest.seats,
        mapFrom((src) => src.seats)
      ),
      forMember(
        (dest) => dest.doors,
        mapFrom((src) => src.doors)
      ),
      forMember(
        (dest) => dest.inventory,
        mapFrom((src) => src.inventory)
      ),
      forMember(
        (dest) => dest.brands,
        mapFrom((src) => src.brands)
      ),
      forMember(
        (dest) => dest.category,
        mapFrom((src) => src.category)
      ),
      forMember(
        (dest) => dest.status,
        mapFrom((src) => src.status)
      ),
      forMember(
        (dest) => dest.listImage,
        mapFrom((src) => src.listImage)
      ),
      forMember(
        (dest) => dest.partType,
        mapFrom((src) => src.partType)
      ),
      forMember(
        (dest) => dest.review,
        mapFrom((src) => src.review)
      )
    );
    createMap(this.mapper, InventoryDto, InventoryEntity);
    createMap(this.mapper, InventoryEntity, InventoryDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.quantity,
        mapFrom((src) => src.quantity)
      )
    );
    createMap(this.mapper, WhitelistDto, WhitelistEntity);
    createMap(this.mapper, WhitelistEntity, WhitelistDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.productId,
        mapFrom((src) => src.productId)
      ),
      forMember(
        (dest) => dest.product,
        mapFrom((src) => src.product)
      )
    );
    createMap(this.mapper, OrderDto, OrderEntity);
    createMap(this.mapper, OrderEntity, OrderDto,
      forMember(
        (dest) => dest.status,
        mapFrom((src) => src.status)
      ),
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.userId,
        mapFrom((src) => src.userId)
      ),
      forMember(
        (dest) => dest.totalAmount,
        mapFrom((src) => src.totalAmount)
      ),
      forMember(
        (dest) => dest.orderItems,
        mapFrom((src) => src.orderItems)
      ),
      forMember(
        (dest) => dest.paymentMethod,
        mapFrom((src) => src.paymentMethod)
      ),
      forMember(
        (dest) => dest.Request,
        mapFrom((src) => src.Request)
      ),
      forMember((dest) => dest.createdAt, mapFrom((src) => src.createdAt)),
      forMember((dest) => dest.updatedAt, mapFrom((src) => src.updatedAt)),
    )
    createMap(this.mapper, ReviewEntity, OrderDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      )
    );
    createMap(this.mapper, TransactionDto, TransactionEntity);
    createMap(this.mapper, TransactionEntity, TransactionDto,
      forMember((dest) => dest.id, mapFrom((src) => src.id)),
      forMember((dest) => dest.orderId, mapFrom((src) => src.orderId)),
      forMember((dest) => dest.userId, mapFrom((src) => src.userId)),
      forMember((dest) => dest.paymentMethod, mapFrom((src) => src.paymentMethod)),
      forMember((dest) => dest.createdAt, mapFrom((src) => src.createdAt)),
      forMember((dest) => dest.updatedAt, mapFrom((src) => src.updatedAt)),
    );
    createMap(this.mapper, OrderItemDto, OrderItemEntity);
    createMap(this.mapper, OrderItemEntity, OrderItemDto,
      forMember((dest) => dest.id, mapFrom((src) => src.id)),
      forMember((dest) => dest.orderId, mapFrom((src) => src.orderId)),
      forMember((dest) => dest.productId, mapFrom((src) => src.productId)),
      forMember((dest) => dest.quantity, mapFrom((src) => src.quantity)),
      forMember((dest) => dest.price, mapFrom((src) => src.price)),
      forMember((dest) => dest.product, mapFrom((src) => src.product)),
    );
    createMap(this.mapper, OrderHistoryDto, OrderHistoryEntity);
    createMap(this.mapper, OrderHistoryEntity, OrderHistoryDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      )
    );
    createMap(this.mapper, ReviewDto, ReviewEntity);
    createMap(this.mapper, ReviewEntity, ReviewDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.productId,
        mapFrom((src) => src.productId)
      ),
      forMember(
        (dest) => dest.product,
        mapFrom((src) => src.product)
      )
    );
    createMap(this.mapper, PromotionDto, PromotionEntity);
    createMap(this.mapper, PromotionEntity, PromotionDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.productId,
        mapFrom((src) => src.productId)
      ),
      forMember(
        (dest) => dest.discount,
        mapFrom((src) => src.discount)
      ),
      forMember(
        (dest) => dest.times,
        mapFrom((src) => src.times)
      ),
      forMember(
        (dest) => dest.image,
        mapFrom((src) => src.image)
      ),
      forMember(
        (dest) => dest.type,
        mapFrom((src) => src.type)
      ),
      forMember(
        (dest) => dest.discountType,
        mapFrom((src) => src.discountType)
      ),
      forMember(
        (dest) => dest.discountValue,
        mapFrom((src) => src.discountValue)
      ),
      forMember(
        (dest) => dest.minUseRequest,
        mapFrom((src) => src.minUseRequest)
      ),
    );
    createMap(this.mapper, VoucherDto, VoucherEntity);
    createMap(this.mapper, VoucherEntity, VoucherDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      ),
      forMember(
        (dest) => dest.promotionId,
        mapFrom((src) => src.promotionId)
      ),
      forMember(
        (dest) => dest.discount,
        mapFrom((src) => src.discount)
      ),
      forMember(
        (dest) => dest.usageLimit,
        mapFrom((src) => src.usageLimit)
      ),
      forMember(
        (dest) => dest.usedCount,
        mapFrom((src) => src.usedCount)
      ),
      forMember(
        (dest) => dest.promotion,
        mapFrom((src) => src.promotion)
      ),
    );
    createMap(this.mapper, RequestDto, RequestEntity);
    createMap(this.mapper, RequestEntity, RequestDto,
      forMember((dest) => dest.userId, mapFrom((src) => src.userId)),
      forMember((dest) => dest.approvedId, mapFrom((src) => src.approvedId)),
      forMember((dest) => dest.price, mapFrom((src) => src.price)),
      forMember((dest) => dest.id, mapFrom((src) => src.id)),
      forMember((dest) => dest.status, mapFrom((src) => src.status)),
      forMember((dest) => dest.user, mapFrom((src) => src.user)),
      forMember((dest) => dest.isUserConfirm, mapFrom((src) => src.isUserConfirm)),
      forMember((dest) => dest.createdAt, mapFrom((src) => src.createdAt)),
      forMember((dest) => dest.images, mapFrom((src) => src.images)),
      forMember((dest) => dest.imageRepairs, mapFrom((src) => src.imageRepairs)),
      forMember((dest) => dest.repairType, mapFrom((src) => src.repairType)),
      forMember((dest) => dest.TaskDetail, mapFrom((src) => src.TaskDetail)),
    );
    createMap(this.mapper, RequestHistoryDto, RequestHistoryEntity);
    createMap(this.mapper, RequestHistoryEntity, RequestHistoryDto);
    createMap(this.mapper, ChatEntity, ChatDto,
      forMember((dest) => dest.sender, mapFrom((src) => src.sender)),
      forMember((dest) => dest.request, mapFrom((src) => src.request))
    );
    createMap(this.mapper, ChatDto, ChatEntity);
    createMap(this.mapper, TaskDetailDto, TaskDetailEntity);
    createMap(this.mapper, TaskDetailEntity, TaskDetailDto,
      forMember((dest) => dest.requestId, mapFrom((src) => src.requestId)),
      forMember((dest) => dest.assignedTo, mapFrom((src) => src.assignedTo)),
      forMember((dest) => dest.status, mapFrom((src) => src.status)),
      forMember((dest) => dest.id, mapFrom((src) => src.id)),
      forMember((dest) => dest.images, mapFrom((src) => src.images)),
      forMember((dest) => dest.comments, mapFrom((src) => src.comments)),
      forMember((dest) => dest.createdAt, mapFrom((src) => src.createdAt)),
      forMember((dest) => dest.assignee, mapFrom((src) => src.assignee)),
      forMember((dest) => dest.isPay, mapFrom((src) => src.isPay)),
      forMember((dest) => dest.price, mapFrom((src) => src.price)),
    );
  }

  mapData<S, D>(source: S, sourceClass: new (...args: unknown[]) => S, destinationClass: new (...args: unknown[]) => D): D {
    return this.mapper.map(source, sourceClass, destinationClass);
  }

  mapListData<S, D>(source: S | S[], sourceClass: new (...args: unknown[]) => S, destinationClass: new (...args: unknown[]) => D): D | D[] {
    if (Array.isArray(source)) {
      return this.mapper.mapArray(source, sourceClass, destinationClass);
    }
    return null;
  }

}





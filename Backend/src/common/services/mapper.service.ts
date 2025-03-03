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
      forMember((dest) => dest.gender, mapFrom((src) => src.gender))

    );
    createMap(this.mapper, UserDto, UserEntity);

    createMap(this.mapper, UserEntity, UserDetail,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      )

    );
    createMap(this.mapper, Notification, NotificationDto);
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
    createMap(this.mapper, ReviewEntity, OrderDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      )
    );
    createMap(this.mapper, OrderItemDto, OrderItemEntity);
    createMap(this.mapper, OrderItemEntity, OrderItemDto,
      forMember(
        (dest) => dest.id,
        mapFrom((src) => src.id)
      )
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




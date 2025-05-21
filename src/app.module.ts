import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './controllers/auth/auth.module';
import { UsersModule } from './controllers/users/users.module';
import { CoreModule } from './core/core.module';
import { HttpContextInterceptor } from './common/interceptors/http-context.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { BrandModule } from './controllers/brand/brand.module';
import { ProductModule } from './controllers/product/product.module';
import { InventoryModule } from './controllers/inventory/inventory.module';
import { WhitelistModule } from './controllers/whitelist/whitelist.module';
import { ReviewModule } from './controllers/review/review.module';
import { OrderModule } from './controllers/order/order.module';
import { OrderHistoryModule } from './controllers/orderHistory/orderHistory.module';
import { PromotionModule } from './controllers/promotion/promotion.module';
import { FilesModule } from './controllers/file/files.module';
import { TransactionModule } from './controllers/transaction/transaction.module';
import { RequestModule } from './controllers/request/request.module';
import { RequestHistoryModule } from './controllers/requestHistory/requestHistory.module';
import { ChatModule } from './controllers/chat/chat.module';
import { TaskDetailModule } from './controllers/taskDetail/taskDetail.module';
import { VoucherModule } from './controllers/voucher/voucher.module';
import { TaskTemplateModule } from './controllers/taskTemplate/taskTemplate.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    CoreModule,
    UsersModule,
    BrandModule,
    ProductModule,
    InventoryModule,
    WhitelistModule,
    ReviewModule,
    OrderModule,
    OrderHistoryModule,
    PromotionModule,
    FilesModule,
    TransactionModule,
    RequestModule,
    RequestHistoryModule,
    ChatModule,
    TaskDetailModule,
    VoucherModule,
    TaskTemplateModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpContextInterceptor, // Kích hoạt Interceptor cho toàn bộ ứng dụng
    },
    
  ],
})
export class AppModule {}

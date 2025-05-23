import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
import { PayOSService } from 'src/common/services/payos/PayOS.service';
@Module({
  controllers: [OrderController],
  providers: [ AuthService ,PrismaService, OrderService, PayOSService]
})
export class OrderModule {}
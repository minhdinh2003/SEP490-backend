import { Module } from '@nestjs/common';
import { OrderHistoryService } from './orderHistory.service';
import { OrderHistoryController } from './orderHistory.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [OrderHistoryController],
  providers: [ AuthService ,PrismaService, OrderHistoryService]
})
export class OrderHistoryModule {}
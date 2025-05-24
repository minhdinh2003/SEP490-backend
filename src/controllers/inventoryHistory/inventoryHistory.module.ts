import { Module } from '@nestjs/common';
import { InventoryHistoryService } from './inventoryHistory.service';
import { InventoryHistoryController } from './inventoryHistory.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [InventoryHistoryController],
  providers: [ AuthService ,PrismaService, InventoryHistoryService]
})
export class InventoryHistoryModule {}
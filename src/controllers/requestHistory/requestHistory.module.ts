import { Module } from '@nestjs/common';
import { RequestHistoryService } from './requestHistory.service';
import { RequestHistoryController } from './requestHistory.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [RequestHistoryController],
  providers: [ AuthService ,PrismaService, RequestHistoryService]
})
export class RequestHistoryModule {}
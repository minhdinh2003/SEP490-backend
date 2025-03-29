import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [TransactionController],
  providers: [ AuthService ,PrismaService, TransactionService]
})
export class TransactionModule {}
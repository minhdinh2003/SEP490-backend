import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { WhitelistController } from './review.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [WhitelistController],
  providers: [ AuthService ,PrismaService, ReviewService]
})
export class ReviewModule {}
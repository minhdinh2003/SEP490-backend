import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [ReviewController],
  providers: [ AuthService ,PrismaService, ReviewService]
})
export class ReviewModule {}
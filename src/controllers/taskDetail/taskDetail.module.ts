import { Module } from '@nestjs/common';
import { TaskDetailService } from './taskDetail.service';
import { TaskDetailController } from './taskDetail.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [TaskDetailController],
  providers: [ AuthService ,PrismaService, TaskDetailService]
})
export class TaskDetailModule {}
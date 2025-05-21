import { Module } from '@nestjs/common';
import { TaskTemplateService } from './taskTemplate.service';
import { TaskTemplateController } from './taskTemplate.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [TaskTemplateController],
  providers: [ AuthService ,PrismaService, TaskTemplateService]
})
export class TaskTemplateModule {}
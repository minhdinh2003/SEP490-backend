import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [ChatController],
  providers: [ AuthService ,PrismaService, ChatService]
})
export class ChatModule {}
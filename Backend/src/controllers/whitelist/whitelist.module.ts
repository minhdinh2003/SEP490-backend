import { Module } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';
import { WhitelistController } from './whitelist.controller';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
@Module({
  controllers: [WhitelistController],
  providers: [ AuthService ,PrismaService, WhitelistService]
})
export class WhitelistModule {}
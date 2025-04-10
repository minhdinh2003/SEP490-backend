import { Module } from '@nestjs/common';
import { PrismaService } from 'src/repo/prisma.service';
import { AuthService } from '../auth/auth.service';
import { FilesController } from './files.controller';
import { FileService } from './files.service';
@Module({
  controllers: [FilesController],
  providers: [ AuthService ,PrismaService, FileService]
})
export class FilesModule {}
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/repo/prisma.service';
import { PayOSService } from './PayOS.service';

@Module({
  providers: [PrismaService, PayOSService ]
})
export class PayOSModule {}

import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { TransactionService } from './transaction.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { AuthGuard } from 'src/core/auth.guard';
import { TransactionEntity } from 'src/model/entity/transaction.entity';
import { TransactionDto } from 'src/model/dto/transaction.dto';

@ApiTags('Transaction')
@Controller('api/transaction')
@UseGuards(AuthGuard)
export class TransactionController extends BaseController<TransactionEntity, Prisma.TransactionHistoryCreateInput> {
    @EntityType(TransactionEntity)
    entity: TransactionEntity;

    @ModelType(TransactionDto)
    model: TransactionDto;
    constructor(private service: TransactionService, coreSevice: CoreService) {
        super("transaction", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: TransactionDto })
    async apiTest(@Body() param: TransactionDto) {
        return null;
    }

}

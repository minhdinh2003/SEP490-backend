import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { RequestHistoryService } from './requestHistory.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { RequestHistoryEntity } from 'src/model/entity/requestHistory.entity';
import { RequestHistoryDto } from 'src/model/dto/requestHistory.dto';

@ApiTags('RequestHistory')
@Controller('api/requestHistory')
export class RequestHistoryController extends BaseController<RequestHistoryEntity, Prisma.RequestHistoryCreateInput> {
    @EntityType(RequestHistoryEntity)
    entity: RequestHistoryEntity;

    @ModelType(RequestHistoryDto)
    model: RequestHistoryDto;
    constructor(private service: RequestHistoryService, coreSevice: CoreService) {
        super("requestHistory", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: RequestHistoryDto })
    async apiTest(@Body() param: RequestHistoryDto) {
        return null;
    }

}

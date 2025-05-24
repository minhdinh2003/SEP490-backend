import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { InventoryHistoryService } from './inventoryHistory.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { AuthGuard } from 'src/core/auth.guard';
import { InventoryHistoryEntity } from 'src/model/entity/inventoryHistory.entity';
import { InventoryHistoryDto } from 'src/model/dto/inventoryHistory.dto';

@ApiTags('InventoryHistory')
@Controller('api/inventoryHistory')
@UseGuards(AuthGuard)
export class InventoryHistoryController extends BaseController<InventoryHistoryEntity, Prisma.InventoryHistoryCreateInput> {
    @EntityType(InventoryHistoryEntity)
    entity: InventoryHistoryEntity;

    @ModelType(InventoryHistoryDto)
    model: InventoryHistoryDto;
    constructor(private service: InventoryHistoryService, coreSevice: CoreService) {
        super("inventoryHistory", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: InventoryHistoryDto })
    async apiTest(@Body() param: InventoryHistoryDto) {
        return null;
    }

}

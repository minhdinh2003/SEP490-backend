import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { InventoryService } from './inventory.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { InventoryEntity } from 'src/model/entity/inventory.entity';
import { InventoryDto } from 'src/model/dto/inventory.dto';

@ApiTags('Inventory')
@Controller('api/inventory')
export class InventoryController extends BaseController<InventoryEntity, Prisma.InventoryCreateInput> {
    @EntityType(InventoryEntity)
    entity: InventoryEntity;

    @ModelType(InventoryDto)
    model: InventoryDto;
    constructor(private inventoryService: InventoryService, coreSevice: CoreService) {
        super("inventory", coreSevice, inventoryService);
    }

    @Post("test")
    @ApiBody({ type: InventoryDto })
    async apiTest(@Body() param: InventoryDto) {
        return null;
    }

}

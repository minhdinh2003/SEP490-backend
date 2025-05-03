import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { InventoryService } from './inventory.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { InventoryEntity } from 'src/model/entity/inventory.entity';
import { InventoryDto } from 'src/model/dto/inventory.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Inventory')
@Controller('api/inventory')
@UseGuards(RolesGuard)
export class InventoryController extends BaseController<InventoryEntity, Prisma.InventoryCreateInput> {
    @EntityType(InventoryEntity)
    entity: InventoryEntity;

    @ModelType(InventoryDto)
    model: InventoryDto;
    constructor(private inventoryService: InventoryService, coreSevice: CoreService) {
        super("inventory", coreSevice, inventoryService);
    }

    @Post("import")
    @Roles(Role.ADMIN, Role.OWNER)
    @ApiOperation({ summary: 'Import products into inventory' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                productId: { type: 'number', description: 'ID of the product' },
                quantity: { type: 'number', description: 'Quantity to import' }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Import successful' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async importProduct(@Body() data: { productId: number, quantity: number }) {
        return await this.inventoryService.importProduct(data.productId, data.quantity);
    }

    async getProductInventory(@Param('id') productId: string) {
        return await this.inventoryService.getProductInventoryStatus(Number(productId));
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get inventory record by ID' })
    @ApiParam({ name: 'id', description: 'Inventory record ID' })
    @ApiResponse({ status: 200, description: 'Returns inventory record' })
    @ApiResponse({ status: 404, description: 'Inventory record not found' })
    async getInventory(@Param('id') id: string) {
        return await this.inventoryService.getById(Number(id));
    }
}
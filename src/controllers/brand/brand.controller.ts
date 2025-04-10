import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { BrandService } from './brand.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { BrandEntity } from 'src/model/entity/brand.entity';
import { BrandDto } from 'src/model/dto/brand.dto';

@ApiTags('Brand')
@Controller('api/brand')

export class BrandController extends BaseController<BrandEntity, Prisma.BrandCreateInput> {
    @EntityType(BrandEntity)
    entity: BrandEntity;

    @ModelType(BrandDto)
    model: BrandDto;
    constructor(private brandService: BrandService, coreSevice: CoreService) {
        super("brand", coreSevice, brandService);
    }

    @Post("test")
    @ApiBody({ type: BrandDto })
    async apiTest(@Body() param: BrandDto) {
        return null;
    }

}

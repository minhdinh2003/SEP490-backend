import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { PromotionService } from './promotion.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { PromotionEntity } from 'src/model/entity/promotion.entity';
import { PromotionDto } from 'src/model/dto/promotion.dto';

@ApiTags('Promotion')
@Controller('api/promotion')
export class PromotionController extends BaseController<PromotionEntity, Prisma.PromotionCreateInput> {
    @EntityType(PromotionEntity)
    entity: PromotionEntity;

    @ModelType(PromotionDto)
    model: PromotionDto;
    constructor(private service: PromotionService, coreSevice: CoreService) {
        super("promotion", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: PromotionDto })
    async apiTest(@Body() param: PromotionDto) {
        return null;
    }

}

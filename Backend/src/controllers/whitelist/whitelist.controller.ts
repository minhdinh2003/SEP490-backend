import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { WhitelistService } from './whitelist.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { WhitelistEntity } from 'src/model/entity/whitelist.entity';
import { WhitelistDto } from 'src/model/dto/whitelist.dto';

@ApiTags('Whitelist')
@Controller('api/whitelist')
export class WhitelistController extends BaseController<WhitelistEntity, Prisma.WhitelistCreateInput> {
    @EntityType(WhitelistEntity)
    entity: WhitelistEntity;

    @ModelType(WhitelistDto)
    model: WhitelistDto;
    constructor(private whitelistService: WhitelistService, coreSevice: CoreService) {
        super("whitelist", coreSevice, whitelistService);
    }

    @Post("test")
    @ApiBody({ type: WhitelistDto })
    async apiTest(@Body() param: WhitelistDto) {
        return null;
    }

}

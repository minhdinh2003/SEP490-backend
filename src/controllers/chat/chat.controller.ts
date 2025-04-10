import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { ChatService } from './chat.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { ChatEntity } from 'src/model/entity/chat.entity';
import { ChatDto } from 'src/model/dto/chat.dto';

@ApiTags('chat')
@Controller('api/chat')
export class ChatController extends BaseController<ChatEntity, Prisma.ChatCreateInput> {
    @EntityType(ChatEntity)
    entity: ChatEntity;

    @ModelType(ChatDto)
    model: ChatDto;
    constructor(private service: ChatService, coreSevice: CoreService) {
        super("chat", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: ChatDto })
    async apiTest(@Body() param: ChatDto) {
        return null;
    }

}

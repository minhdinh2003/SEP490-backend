import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { ChatService } from './chat.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { ChatEntity } from 'src/model/entity/chat.entity';
import { ChatDto } from 'src/model/dto/chat.dto';
import { AuthGuard } from 'src/core/auth.guard';
import { ServiceResponse } from 'src/model/response/service.response';
import { SendRequest } from 'src/model/request/sendMess.request';

@ApiTags('chat')
@Controller('api/chat')
@UseGuards(AuthGuard)
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

    @Post("markAsRead")
    @ApiBody({ type: ChatDto })
    async markAsRead() {
        return ServiceResponse.onSuccess(await this.service.markAsRead());
    }

    @Post("sendMessageToOwner")
    async sendMessageToOwner(@Body() param: SendRequest) {
        return ServiceResponse.onSuccess(await this.service.sendMessageToOwner(param));
    }

    @Post("sendMessageToUser")
    async sendMessageToUser(@Body() param: SendRequest) {
        return ServiceResponse.onSuccess(await this.service.sendMessageToUser(param));
    }

}

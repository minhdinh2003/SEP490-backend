import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { RequestService } from './request.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { RequestEntity } from 'src/model/entity/request.entity';
import { RequestDto } from 'src/model/dto/request.dto';
import { ServiceResponse } from 'src/model/response/service.response';
import { UpdateRequestStatusRequest } from 'src/model/request/updateStatusRequest.request';
import { AuthGuard } from 'src/core/auth.guard';

@ApiTags('Request')
@Controller('api/request')
@UseGuards(AuthGuard)
export class RequestController extends BaseController<RequestEntity, Prisma.RequestCreateInput> {
    @EntityType(RequestEntity)
    entity: RequestEntity;

    @ModelType(RequestDto)
    model: RequestDto;
    constructor(private service: RequestService, coreSevice: CoreService) {
        super("request", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: RequestDto })
    async apiTest(@Body() param: RequestDto) {
        return null;
    }

    @Post("updateStatus/:requestId")
    @ApiBody({type: UpdateRequestStatusRequest})
    async updateRequest(@Param('requestId') requestId: number, @Body() param: UpdateRequestStatusRequest): Promise<ServiceResponse> {
        return ServiceResponse.onSuccess(await this.service.updateRequestStatus(requestId, param));
    }

    @Put("confirm/:requestId")
    async confirm(@Param('requestId') requestId: number): Promise<ServiceResponse> {
        return ServiceResponse.onSuccess(await this.service.confirm(requestId));
    }

}

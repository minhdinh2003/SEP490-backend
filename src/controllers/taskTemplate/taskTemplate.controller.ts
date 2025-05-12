import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { TaskTemplateService } from './taskTemplate.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { TaskTemplateEntity } from 'src/model/entity/taskTemplate.entity';
import { TaskTemplateDto } from 'src/model/dto/taskTemplate.dto';
import { AuthGuard } from 'src/core/auth.guard';

@ApiTags('TaskTemplate')
@Controller('api/taskTemplate')
@UseGuards(AuthGuard)
export class TaskTemplateController extends BaseController<TaskTemplateEntity, Prisma.TaskTemplateCreateInput> {
    @EntityType(TaskTemplateEntity)
    entity: TaskTemplateEntity;

    @ModelType(TaskTemplateDto)
    model: TaskTemplateDto;
    constructor(private service: TaskTemplateService, coreSevice: CoreService) {
        super("taskTemplate", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: TaskTemplateDto })
    async apiTest(@Body() param: TaskTemplateDto) {
        return null;
    }

}

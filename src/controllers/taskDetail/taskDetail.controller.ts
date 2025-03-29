import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { TaskDetailService } from './taskDetail.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { TaskDetailEntity } from 'src/model/entity/taskDetail.entity';
import { TaskDetailDto } from 'src/model/dto/taskDetail.dto';
import { AuthGuard } from 'src/core/auth.guard';

@ApiTags('TaskDetail')
@Controller('api/taskDetail')
@UseGuards(AuthGuard)
export class TaskDetailController extends BaseController<TaskDetailEntity, Prisma.TaskDetailCreateInput> {
    @EntityType(TaskDetailEntity)
    entity: TaskDetailEntity;

    @ModelType(TaskDetailDto)
    model: TaskDetailDto;
    constructor(private service: TaskDetailService, coreSevice: CoreService) {
        super("taskDetail", coreSevice, service);
    }

    @Post("test")
    @ApiBody({ type: TaskDetailDto })
    async apiTest(@Body() param: TaskDetailDto) {
        return null;
    }

}

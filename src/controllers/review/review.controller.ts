import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { ReviewService } from './review.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { ReviewEntity } from 'src/model/entity/review.entity';
import { ReviewDto } from 'src/model/dto/review.dto';

@ApiTags('Review')
@Controller('api/review')
export class ReviewController extends BaseController<ReviewEntity, Prisma.ReviewCreateInput> {
    @EntityType(ReviewEntity)
    entity: ReviewEntity;

    @ModelType(ReviewDto)
    model: ReviewDto;
    constructor(private reviewService: ReviewService, coreSevice: CoreService) {
        super("review", coreSevice, reviewService);
    }

    @Post("test")
    @ApiBody({ type: ReviewDto })
    async apiTest(@Body() param: ReviewDto) {
        return null;
    }

}

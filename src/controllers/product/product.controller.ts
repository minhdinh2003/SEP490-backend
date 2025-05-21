import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { BaseController } from 'src/base/base.controller';
import { ProductService } from './product.service';
import { CoreService } from 'src/core/core.service';
import { EntityType, ModelType } from 'src/common/reflect.metadata';
import { ProductEntity } from 'src/model/entity/product.entity';
import { ProductDto } from 'src/model/dto/product.dto';
import { AddStockRequest } from 'src/model/request/stock.request';
import { ServiceResponse } from 'src/model/response/service.response';

@ApiTags('Product')
@Controller('api/product')
export class ProductController extends BaseController<ProductEntity, Prisma.ProductCreateInput> {
    @EntityType(ProductEntity)
    entity: ProductEntity;

    @ModelType(ProductDto)
    model: ProductDto;
    constructor(private productService: ProductService, coreSevice: CoreService) {
        super("product", coreSevice, productService);
    }

    @Post("test")
    @ApiBody({ type: ProductDto })
    async apiTest(@Body() param: ProductDto) {
        return null;
    }

    @Post("addStock")
    async addStock(@Body() param: AddStockRequest) {
        return ServiceResponse.onSuccess(await this.productService.addStock(param));
    }
}

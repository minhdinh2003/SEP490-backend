import { 
    Get, Post, Put, Delete, Param, Body, UseGuards 
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { BaseService } from './base.service';
import { CoreService } from 'src/core/core.service';
import { ServiceResponse } from 'src/model/response/service.response';
import { PageRequest } from 'src/model/request/page.request';
import { Public } from 'src/utils/public.decorator';
import { AuthGuard } from 'src/core/auth.guard';

export class BaseController<TEntity extends { id: number }, TModel> {
    protected readonly entityFactory: new () => TEntity;
    protected readonly _mapperService;
    protected TEntityClass: any;
    protected TModelClass: any;

    constructor(
        modelName: string,
        coreService: CoreService,
        protected readonly baseService: BaseService<TEntity, TModel>
    ) {
        this.baseService.setRepo(modelName);
        this._mapperService = coreService.getMapperSerivce();
        this.TEntityClass = Reflect.getMetadata('design:type', this, 'entity');
        this.TModelClass = Reflect.getMetadata('design:type', this, 'model');
    }

    /** Lấy tất cả dữ liệu */
    @Get('all')
    async getAll() {
        const data = await this.baseService.getMany({});
        return ServiceResponse.onSuccess(
            this._mapperService.mapListData(data, this.TEntityClass, this.TModelClass)
        );
    }

    /** Lấy dữ liệu theo ID */
    @Get(':id')
    async getById(@Param('id') id: number): Promise<ServiceResponse> {
        const data = await this.baseService.getOne({ id });
        const result = this._mapperService.mapData(data, this.TEntityClass, this.TModelClass);
        return ServiceResponse.onSuccess(result);
    }

    /** Lấy chi tiết theo ID với tham chiếu */
    @Post(':id/reference')
    async getDetail(
        @Param('id') id: number,
        @Body() includeReferences: { [key: string]: boolean } = {}
    ): Promise<ServiceResponse> {
        const data = await this.baseService.getOneAndReference({ id }, includeReferences);
        const result = this._mapperService.mapData(data, this.TEntityClass, this.TModelClass);
        
        if (!result) {
            return ServiceResponse.onBadRequest(null, "Not found");
        }
        return ServiceResponse.onSuccess(result);
    }

    /** Tạo mới dữ liệu */
    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() param: TEntity) {
        const result = await this.baseService.add(param);
        return ServiceResponse.onSuccess(result);
    }

    /** Cập nhật nhiều bản ghi */
    @Put('/bulk-update')
    @UseGuards(AuthGuard)
    async updateMultiple(@Body() updates: { id: number, model: Partial<TEntity> }[]) {
        const result = await this.baseService.updateMultiple(updates);
        return ServiceResponse.onSuccess(result, "Bulk Update Success");
    }

    /** Cập nhật dữ liệu theo ID */
    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: number, @Body() model: Partial<TEntity>) {
        await this.baseService.update(id, model);
        return ServiceResponse.onSuccess(id, "Update Success");
    }

    /** Xóa dữ liệu theo ID */
    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: number) {
        const data = await this.baseService.getOne({ id });
        if (!data) {
            return ServiceResponse.onBadRequest(null, "Entity not exist");
        }
        await this.baseService.remove(id);
        return ServiceResponse.onSuccess(id, "Deleted successfully");
    }

    /** Xóa nhiều bản ghi theo danh sách ID */
    @Delete('delete-many')
    @UseGuards(AuthGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                ids: { type: 'array', items: { type: 'number' } }
            }
        }
    })
    async deleteMany(@Body('ids') ids: number[]) {
        if (!ids || ids.length === 0) {
            return ServiceResponse.onBadRequest(null, "No IDs provided");
        }
        await this.baseService.removeIDs(ids);
        return ServiceResponse.onSuccess(ids, `${ids.length} records deleted successfully`);
    }

    /** Phân trang dữ liệu */
    @Post('paging')
    @Public()
    async paging(@Body() param: PageRequest): Promise<ServiceResponse> {
        const result = await this.baseService.getPaging(param);
        result.data = this._mapperService.mapListData(result.data, this.TEntityClass, this.TModelClass);
        return ServiceResponse.onSuccess(result);
    }
}

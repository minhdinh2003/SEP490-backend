// core/repositories/base.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { validateInputs } from 'src/utils/common.utils';
import { PageRequest } from 'src/model/request/page.request';
import { PageResult } from 'src/model/response/page.response';

export class BaseRepository<T extends { id: number }, U> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(prisma: PrismaClient, model: any) {
    this.prisma = prisma;
    this.model = model;
  }

  //#region  Get

  // Lấy tất cả bản ghi
  async getAll(): Promise<T[]> {
    return this.model.findMany();
  }

  // Lấy bản ghi theo ID
  async getById(id: number): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findUnique(where: any, options?: any): Promise<T | null> {
    return this.model.findUnique({
      where,
      select: {
        ...options,
      },
    });
  }

  // Tìm kiếm nhiều bản ghi theo một trường nhất định
  async findByField(fieldName: string, value: any): Promise<T[]> {
    return this.model.findMany({
      where: {
        [fieldName]: value,
      },
    });
  }

  // Tìm kiếm một bản ghi theo một trường nhất định
  async findOneByField(fieldName: string, value: any): Promise<T | null> {
    return this.model.findFirst({
      where: {
        [fieldName]: value,
      },
    });
  }

  // Tìm kiếm nhiều bản ghi theo danh sách trường với một giá trị
  async findByFields(fields: string[], value: any): Promise<T[]> {
    const whereCondition = fields.reduce((acc, field) => {
      acc[field] = value;
      return acc;
    }, {});
    return this.model.findMany({
      where: whereCondition,
    });
  }

  // Tìm kiếm một bản ghi theo danh sách trường với một giá trị
  async findOneByFields(fields: string[], value: any): Promise<T | null> {
    const whereCondition = fields.reduce((acc, field) => {
      acc[field] = value;
      return acc;
    }, {});
    return this.model.findFirst({
      where: whereCondition,
    });
  }

  // Tìm kiếm nhiều bản ghi theo danh sách trường truyền vào và giá trị tương ứng
  async findByFieldList(fieldList: { [key: string]: any }): Promise<T[]> {
    return this.model.findMany({
      where: fieldList,
    });
  }

  // Tìm kiếm một bản ghi theo danh sách trường truyền vào và giá trị tương ứng
  async findOneByFieldList(fieldList: {
    [key: string]: any;
  }): Promise<T | null> {
    return this.model.findFirst({
      where: fieldList,
    });
  }

  // Tìm kiếm một bản ghi theo điều kiện phức tạp
  async findOneWithCondition(conditions: {
    [key: string]: any;
  }): Promise<T | null> {
    return this.model.findFirst({
      where: conditions,
    });
  }

  // Tìm kiếm một bản ghi theo điều kiện phức tạp
  async findOneWithConditionAndGetReference(
    conditions: { [key: string]: any },
    includeReferences: { [key: string]: boolean } = {},
  ): Promise<T | null> {
    return this.model.findFirst({
      where: conditions,
      include: includeReferences,
    });
  }

  // Tìm kiếm nhiều bản ghi theo điều kiện phức tạp
  async findManyWithCondition(conditions: {
    [key: string]: any;
  }): Promise<T[] | null> {
    return this.model.findMany({
      where: conditions,
    });
  }
  //#endregion

  // Tạo mới bản ghi
  async create(data: any, option?: any, moreData: any = {}): Promise<T> {
    const createOption: any = {
      data: {
        ...data,
        ...moreData,
      },
    };
    if (option && Object.keys(option).length > 0) {
      createOption.select = option.select || { id: true };
    }
    return this.model.create(createOption);
  }

  // Cập nhật bản ghi theo ID
  async update(
    id: number,
    data: Partial<T>,
    moreData: object = {},
  ): Promise<T> {
    return this.model.update({
      where: { id },
      data: {
        ...data,
        ...moreData,
      },
    });
  }

  async updateMany(
    conditions: { [key: string]: any },
    data: Partial<T>,
  ): Promise<T> {
    return this.model.update({
      where: { conditions },
      data: {
        ...data,
      },
    });
  }

  // Xóa bản ghi theo ID
  async delete(id: number): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }
  // Xóa danh sách IDs
  async deleteByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    return this.model.deleteMany({
      where: {
        id: {
          in: ids, // Điều kiện xóa theo danh sách id
        },
      },
    });
  }

  async getPaging(
    pageRequest: PageRequest,
    isIgnoreFilter: boolean = false,
    ignoreFields: string[] = [],
  ): Promise<PageResult<T>> {
    validateInputs(pageRequest.pageNumber, pageRequest.pageSize);

    let query: any = {
      where: {},
    };

    // Xử lý searchKey và searchFields
    if (pageRequest.searchKey && pageRequest.searchFields) {
      query.where.OR = pageRequest.searchFields
        .filter((field) => !ignoreFields.includes(field)) // Lọc các trường hợp lệ
        .map((field) => ({
          [field]: { contains: pageRequest.searchKey }, // Tìm kiếm không phân biệt hoa thường
        }));
    }

    // Xử lý conditions
    if (pageRequest.conditions && pageRequest.conditions.length > 0) {
      pageRequest.conditions.forEach((cond) => {
        if (!ignoreFields.includes(cond.key)) {
          switch (cond.condition) {
            case 'equal':
              query.where[cond.key] = cond.value;
              break;
            case 'contain':
              query.where[cond.key] = { contains: cond.value };
              break;
            case 'gt':
              query.where[cond.key] = { gt: cond.value };
              break;
            case 'lt':
              query.where[cond.key] = { lt: cond.value };
              break;
            case 'subquery':
              query.where[cond.key] = cond.value;
              break;
            // truyền cả where lên
            case 'raw':
              query.where = cond.value;
              break;
            // Thêm các điều kiện khác nếu cần
            default:
              break;
          }
        }
      });
    } else {
      query.where = {};
    }

    // Nếu cần bỏ qua filter
    if (isIgnoreFilter) {
      query.where = {};
    }

    // Xử lý sắp xếp
    if (pageRequest.sortOrder) {
      const [field, order] = pageRequest.sortOrder.split(' ');
      if (!ignoreFields.includes(field)) {
        query.orderBy = { [field]: order || 'asc' }; // Mặc định là 'asc'
      }
    }

    // Đếm tổng số items
    const totalItems = await this.model.count({ where: query.where });

    // Thực hiện phân trang và lấy dữ liệu
    const data = await this.doGetDataPaging(query, pageRequest);

    return {
      data,
      totalCount: totalItems,
    };
  }

  async doGetDataPaging(query, pageRequest) {
    return await this.model.findMany({
      ...query,
      skip: (pageRequest.pageNumber - 1) * pageRequest.pageSize,
      take: pageRequest.pageSize,
      include: pageRequest.includeReferences
        ? pageRequest.includeReferences
        : {},
    });
  }
}

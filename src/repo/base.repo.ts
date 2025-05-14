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

  async getAll(): Promise<T[]> {
    return this.model.findMany();
  }

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

  async findByField(fieldName: string, value: any): Promise<T[]> {
    return this.model.findMany({
      where: {
        [fieldName]: value,
      },
    });
  }

  async findOneByField(fieldName: string, value: any): Promise<T | null> {
    return this.model.findFirst({
      where: {
        [fieldName]: value,
      },
    });
  }

  async findByFields(fields: string[], value: any): Promise<T[]> {
    const whereCondition = fields.reduce((acc, field) => {
      acc[field] = value;
      return acc;
    }, {});
    return this.model.findMany({
      where: whereCondition,
    });
  }

  async findOneByFields(fields: string[], value: any): Promise<T | null> {
    const whereCondition = fields.reduce((acc, field) => {
      acc[field] = value;
      return acc;
    }, {});
    return this.model.findFirst({
      where: whereCondition,
    });
  }

  async findByFieldList(fieldList: { [key: string]: any }): Promise<T[]> {
    return this.model.findMany({
      where: fieldList,
    });
  }

  async findOneByFieldList(fieldList: { [key: string]: any }): Promise<T | null> {
    return this.model.findFirst({
      where: fieldList,
    });
  }

  async findOneWithCondition(conditions: { [key: string]: any }): Promise<T | null> {
    return this.model.findFirst({
      where: conditions,
    });
  }

  async findOneWithConditionAndGetReference(
    conditions: { [key: string]: any },
    includeReferences: { [key: string]: boolean } = {},
  ): Promise<T | null> {
    return this.model.findFirst({
      where: conditions,
      include: includeReferences,
    });
  }

  async findManyWithCondition(conditions: { [key: string]: any }): Promise<T[] | null> {
    return this.model.findMany({
      where: conditions,
    });
  }

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

  async update(id: number, data: Partial<T>, moreData: object = {}): Promise<T> {
    return this.model.update({
      where: { id },
      data: {
        ...data,
        ...moreData,
      },
    });
  }

  async updateMany(conditions: { [key: string]: any }, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { conditions },
      data: {
        ...data,
      },
    });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async deleteByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    return this.model.deleteMany({
      where: {
        id: {
          in: ids,
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

    if (pageRequest.searchKey && pageRequest.searchFields) {
      query.where.AND = pageRequest.searchFields
        .filter((field) => !ignoreFields.includes(field))
        .map((field) => ({
          [field]: { contains: pageRequest.searchKey },
        }));
    }

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
            case 'different':
              query.where[cond.key] = { not: cond.value };
              break;
            case 'raw':
              if (query?.where?.AND?.length > 0 && cond.value?.AND?.length > 0) {
                query.where.AND = [...query.where.AND, ...cond.value.AND];
              } else {
                query.where = cond.value;
              }
              break;
            default:
              break;
          }
        }
      });
    } else {
      query.where = query.where || {};
    }

    if (isIgnoreFilter) {
      query.where = {};
    }

    if (pageRequest.sortOrder) {
      const [field, order] = pageRequest.sortOrder.split(' ');
      if (!ignoreFields.includes(field)) {
        query.orderBy = { [field]: order || 'asc' };
      }
    }

    const totalItems = await this.model.count({ where: query.where });

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

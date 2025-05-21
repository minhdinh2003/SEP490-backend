import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base.entity';

export class TaskTemplateEntity extends BaseEntity {
    @AutoMap()
    id: number; // Khóa chính, tự động tăng

    @AutoMap()
    title: string; // Tiêu đề công việc

    @AutoMap()
    priority: number; // Thứ tự ưu tiên

    @AutoMap()
    items: any;


    @AutoMap()
    price?: number;

    constructor(partial?: Partial<TaskTemplateEntity>) {
        super();
        if (partial) {
            Object.assign(this, partial);
        }
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date(); // Luôn cập nhật thời gian cập nhật
    }
}
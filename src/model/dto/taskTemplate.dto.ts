import { BaseDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class TaskTemplateDto extends BaseDto {
    @ApiProperty()
    @AutoMap()
    id: number; // Khóa chính, tự động tăng

    @ApiProperty()
    @AutoMap()
    title: string; // Tiêu đề công việc

    @ApiProperty()
    @AutoMap()
    priority: number; // Thứ tự ưu tiên

    // Phương thức khởi tạo để tạo một TaskTemplateDto từ dữ liệu
    constructor(partial: Partial<TaskTemplateDto>) {
        super();
        Object.assign(this, partial);
    }
}
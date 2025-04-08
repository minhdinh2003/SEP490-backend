import { BaseDto } from "./base.dto";
import { RequestDto } from "./request.dto";
import { UserDto } from "./user.dto";
import { TaskStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from '@automapper/classes';

export class TaskDetailDto extends BaseDto {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap()
  requestId: number;

  @ApiProperty({ type: () => RequestDto })
  @AutoMap(() => RequestDto)
  request: RequestDto;

  @ApiProperty({ required: false })
  @AutoMap()
  assignedTo?: number;

  @ApiProperty({ type: () => UserDto, required: false })
  @AutoMap(() => UserDto)
  assignee?: UserDto;

  @ApiProperty()
  @AutoMap()
  description: string;

  @ApiProperty()
  @AutoMap()
  title: string;

  @ApiProperty({ enum: TaskStatus })
  @AutoMap()
  status: TaskStatus;

  @ApiProperty({ required: false })
  @AutoMap()
  deadline?: Date;

  @ApiProperty({ required: false })
  @AutoMap()
  images?: any; // Thay đổi thành kiểu dữ liệu cụ thể nếu có cấu trúc JSON xác định

  @AutoMap()
  imageRepairs?: any;

  @AutoMap()
  isPay: boolean;

  @AutoMap()
  price?: number;

  @ApiProperty({ required: false })
  @AutoMap()
  comments?: any; // Thay đổi thành kiểu dữ liệu cụ thể nếu có cấu trúc JSON xác định

  constructor(partial?: Partial<TaskDetailDto>) {
    super();
    Object.assign(this, partial);
  }
}
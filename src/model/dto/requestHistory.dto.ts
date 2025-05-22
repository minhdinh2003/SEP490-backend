import { BaseDto } from "./base.dto";
import { UserDto } from "./user.dto";
import { RequestDto } from "./request.dto";
import { RequestStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from '@automapper/classes';

export class RequestHistoryDto extends BaseDto {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap()
  requestId: number;

  @ApiProperty({ type: () => RequestDto })
  @AutoMap(() => RequestDto)
  Request: RequestDto;

  @ApiProperty({ enum: RequestStatus })
  @AutoMap()
  status: RequestStatus;

  @ApiProperty({ required: false })
  @AutoMap()
  comment?: string;

  @ApiProperty({ required: false })
  @AutoMap()
  userId?: number;

  @ApiProperty({ type: () => UserDto, required: false })
  @AutoMap(() => UserDto)
  User?: UserDto;

  constructor(partial?: Partial<RequestHistoryDto>) {
    super();
    Object.assign(this, partial);
  }
}
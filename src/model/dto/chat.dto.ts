import { BaseDto } from "./base.dto";
import { RequestDto } from "./request.dto";
import { UserDto } from "./user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AutoMap } from '@automapper/classes';

export class ChatDto extends BaseDto {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap()
  requestId: number;

  @ApiProperty({ type: () => RequestDto })
  @AutoMap(() => RequestDto)
  request: RequestDto;

  @ApiProperty()
  @AutoMap()
  senderId: number;

  @ApiProperty()
  @AutoMap()
  receiveId: number;

  @ApiProperty({ type: () => UserDto })
  @AutoMap(() => UserDto)
  sender: UserDto;

  @AutoMap()
  isNormal: boolean;

  @AutoMap()
  isRead: boolean;

  @ApiProperty()
  @AutoMap()
  message: string;
  constructor(partial?: Partial<ChatDto>) {
    super();
    Object.assign(this, partial);
  }
}
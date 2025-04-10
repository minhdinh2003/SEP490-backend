
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { BaseDto } from './base.dto';

export class NotificationDto extends BaseDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    senderId: number;

    @AutoMap()
    @ApiProperty()
    senderName: string;

    @AutoMap()
    @ApiProperty()
    receiveId: number;

    @AutoMap()
    @ApiProperty()
    type: string;

    @AutoMap()
    @ApiProperty()
    rawData: string;

    @AutoMap()
    @ApiProperty()
    isViewed: boolean;
}
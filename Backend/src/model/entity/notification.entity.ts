import { AutoMap } from '@automapper/classes';
import { BaseEntity } from './base.entity';

export class Notification extends BaseEntity{
  @AutoMap()
  id: number;

  @AutoMap()
  senderId: number;

  @AutoMap()
  senderName: string;

  @AutoMap()
  receiveId: number;

  @AutoMap()
  type: string;

  @AutoMap()
  rawData: string;

  @AutoMap()
  isViewed: boolean;
}

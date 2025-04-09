import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';

export class VoucherEntity extends BaseEntity {
  id: number;

  @AutoMap()
  code: string;

  @AutoMap()
  promotionId: number;

  @AutoMap()
  discount: number;

  @AutoMap()
  usageLimit: number;

  @AutoMap()
  usedCount: number;

  @AutoMap()
  expiryDate: Date;

  @AutoMap()
  validFrom : Date; 

  @AutoMap()
  validTo: Date;

  @AutoMap()
  userId?: number; 

  @AutoMap()
  voucherType: 'individual' | 'public'; 


  constructor(partial?: Partial<VoucherEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
  }
}

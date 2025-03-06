// page-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { PaymentMethod } from '../enum/payment.enum';

export class OrderItemRequest {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  paymentMethod: PaymentMethod.BankOnline;
}

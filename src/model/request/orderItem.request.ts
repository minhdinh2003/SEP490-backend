// page-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { PaymentMethod } from '../enum/payment.enum';
import { Type } from 'class-transformer';

export class OrderItemRequest {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsInt()
  paymentMethod: number;
}



export class CreateOrderRequest {
  @ApiProperty({ type: [OrderItemRequest] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequest) 
  orderItems: OrderItemRequest[];

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
// page-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
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
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  voucherCode?: string;
}

export class OwnerCreateOrderRequest {
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
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  voucherCode?: string;

  @IsInt()
  userId: number;

  @IsInt()
  agreedPrice: number;
}



export class CreateOrderRequestRepair {

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsInt()
  paymentMethod: number;

  @ApiProperty()
  @IsInt()
  requestId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  voucherCode?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPay?: boolean;
}
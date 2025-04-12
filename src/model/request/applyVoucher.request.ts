import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ApplyVoucherRequest {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;

  @IsString()
  voucherCode?: string;
}

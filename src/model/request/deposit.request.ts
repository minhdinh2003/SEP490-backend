import { IsInt, IsOptional, Min } from 'class-validator';

export class DepositRequest {
  @IsInt()
  @Min(2000, { message: 'Số tiền hợp lệ' })
  amount: number;

  @IsOptional()
  lang: string = 'vn';

  @IsOptional()
  bankCode?: string;
}

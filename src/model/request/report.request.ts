import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class ReportRequest {
  @IsDateString({ strict: true }, { message: 'fromDate phải là định dạng ngày tháng hợp lệ (YYYY-MM-DD)' })
  fromDate: string; // Ngày bắt đầu (định dạng YYYY-MM-DD)

  @IsDateString({ strict: true }, { message: 'toDate phải là định dạng ngày tháng hợp lệ (YYYY-MM-DD)' })
  toDate: string; // Ngày kết thúc (định dạng YYYY-MM-DD)

}
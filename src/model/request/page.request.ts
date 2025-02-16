// page-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PageRequest {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNumber: number;

  @ApiProperty()
  @IsOptional()
  conditions?: Condition[];


  @ApiProperty()
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  searchKey?: string;

  @ApiProperty()
  @IsOptional()
  searchFields?: string[];

  @ApiProperty()
  @IsOptional()
  includeReferences: { [key: string]: boolean } = null;
}



export class Condition {
  @ApiProperty({ description: 'Trường cần so sánh' })
  key: string;

  @ApiProperty({ description: 'Điều kiện so sánh: "contain", "equal", "gt", "lt", v.v.' })
  condition: string;

  @ApiProperty({ description: 'Giá trị để so sánh' })
  value: any;
}
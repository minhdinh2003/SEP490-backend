import {
    IsNotEmpty,
    IsEmail,
    IsString
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class LoginRequest {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    password: string
}


import {
    IsNotEmpty,
    IsEmail,
    IsString
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StringDecoder } from 'node:string_decoder';
export class ForgotPassswordRequest {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    email: string
}



export class ResetPasswordRequest {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    email: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    Otp: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    newPassword: string
}

export class ChangePasswordRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    password: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    newPassword: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    confirmPassWord : StringDecoder
}
import {
    IsNotEmpty,
    IsEmail,
    MinLength,
    MaxLength,
} from 'class-validator';
import { BaseDto } from 'src/model/dto/base.dto';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto extends BaseDto{
    @IsEmail()
    @MaxLength(255)
    @AutoMap()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    @AutoMap()
    @ApiProperty()
    password: string;

}

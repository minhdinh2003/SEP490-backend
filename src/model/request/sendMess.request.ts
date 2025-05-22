import { IsBoolean, IsNumber, IsString } from "class-validator";


export class SendRequest {
    @IsString()
    message: string;

    @IsNumber()
    senderId: number;

    @IsNumber()
    receiveId: number;

    @IsBoolean()
    isNormal: boolean;

    @IsBoolean()
    isRead: boolean;

    @IsNumber()
    requestId: number;
}
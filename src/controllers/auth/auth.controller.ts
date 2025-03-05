import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RegisterDto } from '../../model/dto/auth.dto';
import { AuthService } from './auth.service';
import { ServiceResponse } from 'src/model/response/service.response';
import { LoginRequest } from 'src/model/request/login.request';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ChangePasswordRequest, ForgotPassswordRequest, ResetPasswordRequest } from 'src/model/request/forgotPassword.request';
import { AuthGuard } from 'src/core/auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    @ApiBody({type: RegisterDto})
    register(@Body() body: RegisterDto): Promise<ServiceResponse>{
        return this.authService.register(body);
    }

    @Post('login')
    @ApiBody({type: LoginRequest})
    login(@Body() body: LoginRequest): Promise<ServiceResponse>{
        return this.authService.login(body);
    }

    @Post('forgotPassword')
    @ApiBody({type: ForgotPassswordRequest})
    forgotPassword(@Body() body: ForgotPassswordRequest): Promise<ServiceResponse>{
        return this.authService.forgotPassword(body);
    }

    @Post('resetPassword')
    @ApiBody({type: ResetPasswordRequest})
    resetPassword(@Body() body: ResetPasswordRequest): Promise<ServiceResponse>{
        return this.authService.resetPassword(body);
    }

    @UseGuards(AuthGuard) // Bảo vệ route bằng JWT Guard
    @Post('logout')
    logout(@Req() request: Request): any {
        const token = request.headers['authorization']; // Lấy token từ request headers
        if (token) {
            this.authService.addTokenToBlacklist(token);
        }

        return { message: 'Logout successful' };
    }

    @UseGuards(AuthGuard) // Bảo vệ route bằng JWT Guard
    @Post('change-password')
    changePassword(@Body() request: ChangePasswordRequest): any {
        return this.authService.changePassword(request);
    }
}

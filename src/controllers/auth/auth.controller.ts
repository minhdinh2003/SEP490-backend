import { Controller, Post, Body, UseGuards, Req, Query, Get } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags, ApiQuery } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthGuard } from 'src/core/auth.guard';

import { RegisterDto } from '../../model/dto/auth.dto';
import { LoginRequest } from 'src/model/request/login.request';
import { ChangePasswordRequest, ForgotPassswordRequest, ResetPasswordRequest } from 'src/model/request/forgotPassword.request';
import { ServiceResponse } from 'src/model/response/service.response';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiBody({ type: RegisterDto })
    register(@Body() body: RegisterDto): Promise<ServiceResponse> {
        return this.authService.register(body);
    }

    @Post('login')
    @ApiBody({ type: LoginRequest })
    login(@Body() body: LoginRequest): Promise<ServiceResponse> {
        return this.authService.login(body);
    }

    
    @Post('forgot-password')
    @ApiBody({ type: ForgotPassswordRequest })
    forgotPassword(@Body() body: ForgotPassswordRequest): Promise<ServiceResponse> {
        return this.authService.forgotPassword(body);
    }

    @Post('reset-password')
    @ApiBody({ type: ResetPasswordRequest })
    resetPassword(@Body() body: ResetPasswordRequest): Promise<ServiceResponse> {
        return this.authService.resetPassword(body);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Req() request: Request): Promise<ServiceResponse> {
        const token = request.headers['authorization'];
        if (token) {
            this.authService.addTokenToBlacklist(token);
        }
        return Promise.resolve(ServiceResponse.onSuccess({ message: 'Logout successful' }));
    }

    @UseGuards(AuthGuard)
    @Post('change-password')
    @ApiBody({ type: ChangePasswordRequest })
    changePassword(@Body() request: ChangePasswordRequest): Promise<ServiceResponse> {
        return this.authService.changePassword(request);
    }

}

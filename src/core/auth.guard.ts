// auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { validateToken } from 'src/utils/token.utils';
import { UserEntity } from 'src/model/entity/user.entity';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/utils/public.decorator';
import { AuthService } from 'src/controllers/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private reflector: Reflector, private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic){
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader  = request.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException({mesagge: "Token is missing"}, HttpStatus.UNAUTHORIZED)
    }

    const token = authHeader.split(' ')[1];

    if (!token || this.authService.isTokenBlacklisted(token)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const userInfo = validateToken(token);
    if (!userInfo){
      throw new HttpException({mesagge: "Invalid or expired token"}, HttpStatus.UNAUTHORIZED)
    }

    request.user = userInfo as UserEntity;
    return true;

  }
}

// common/interceptors/http-context.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpContextService } from '../services/http-context.service';

@Injectable()
export class HttpContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Lưu request vào HttpContextService để có thể truy cập từ bất cứ đâu
    HttpContextService.setRequest(request);

    return next.handle().pipe(
      tap(() => {
        // Sau khi xử lý xong có thể xóa request từ HttpContextService (optional)
        HttpContextService.clear();
      }),
    );
  }
}

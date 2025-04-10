import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceResponse } from 'src/model/response/service.response';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Kiểm tra nếu là HttpException
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse() // Sử dụng message từ HttpException
      : 'Internal server error';

    console.error('Exception thrown:', exception); // Log ra console nếu muốn

    var result = new ServiceResponse();
    result.success = false;
    result.message = message["message"] || message;
    result.data = {
        path: request.url
    };
    result.statusCode = status;
    result.devMessage = exception['message'];
    response.status(status).json(result);
  }
}

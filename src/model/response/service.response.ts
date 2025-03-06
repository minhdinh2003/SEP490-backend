import { HttpStatus } from "@nestjs/common";

// service.response.ts
export class ServiceResponse {
    success: boolean = true;
    message: string;
    data: any;
    statusCode: number = HttpStatus.OK;
    devMessage: string;
  
    static onUnauthorized(data: any = null): ServiceResponse {
      return {
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        data,
        devMessage: 'Forbidden',
      } as ServiceResponse;
    }
  
    static onUnauthenticated(data: any = null): ServiceResponse {
      return {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        data,
        devMessage: 'Unauthorized',
      } as ServiceResponse;
    }
  
    static onBadRequest(data: any = null, message: any = ""): ServiceResponse {
      return {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        data,
        devMessage: 'Bad Request',
        message: message
      } as ServiceResponse;
    }
  
    static onBadRequestWithValidationErrors(errors: any): ServiceResponse {
      const formattedErrors = Object.values(errors).flat();
      return {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        data: formattedErrors,
        devMessage: 'Invalid Param',
      } as ServiceResponse;
    }
  
    static onSuccess(data: any = null, message: string = ""): ServiceResponse {
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data,
        devMessage: 'OK',
        message: message
      } as ServiceResponse;
    }
  }
  
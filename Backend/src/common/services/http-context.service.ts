// common/services/http-context.service.ts
import { Request } from 'express';

export class HttpContextService {
  private static request: Request;

  static setRequest(req: Request) {
    this.request = req;
  }

  static getRequest(): Request {
    return this.request;
  }

  static clear() {
    this.request = null;
  }

  getUserID(): any {
    return HttpContextService.request?.user?.id;
  }
  getFullname(): any {
    return HttpContextService.request?.user?.fullName;
  }

  getEmail(): any {
    return HttpContextService.request?.user?.email;
  }

  getRole(): any {
    return HttpContextService.request?.user?.role;
  }


}

import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  key: string;

  constructor(public auth: AuthService) {
    this.auth.data.subscribe(data => {
      this.key = data.key;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.key) {
      req = req.clone({
        setHeaders: {
          Authorization: `token ${this.key}`
        }
      });
    }
    return next.handle(req);
  }
}

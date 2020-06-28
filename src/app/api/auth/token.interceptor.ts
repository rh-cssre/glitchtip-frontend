import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  key?: string | null;

  constructor(public auth: AuthService) {
    this.auth.data.subscribe((data) => {
      this.key = data.key;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.key) {
      req = req.clone({
        setHeaders: {
          Authorization: `token ${this.key}`,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.auth.logout();
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }
}

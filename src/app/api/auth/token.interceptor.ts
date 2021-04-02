import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { EMPTY, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 403 &&
          error.error.detail === "Authentication credentials were not provided."
        ) {
          this.auth.expireAuth();
          return EMPTY;
        }
        return throwError(error);
      })
    );
  }
}

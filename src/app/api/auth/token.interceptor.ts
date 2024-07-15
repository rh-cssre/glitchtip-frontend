import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { EMPTY, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        (error.status === 401 && error.error.detail === "Unauthorized") ||
        (error.status === 403 &&
          error.error.detail ===
            "Authentication credentials were not provided.")
      ) {
        auth.expireAuth();
        return EMPTY;
      } else if (error.status === 0) {
        // Probably an aborted request
        console.warn(error);
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
};

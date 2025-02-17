import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { EMPTY, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "src/app/auth.service";
import { Router } from "@angular/router";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        (error.status === 401 && error.error.detail === "Unauthorized") ||
        (error.status === 403 &&
          error.error.detail ===
            "Authentication credentials were not provided.")
      ) {
        auth.expireAuth();
        let queryParams = {
          next: router.url,
        };
        router.navigate(["/login"], { queryParams });
        return EMPTY;
      } else if (error.status === 0) {
        // Probably an aborted request
        console.warn(error);
        return EMPTY;
      }
      return throwError(() => error);
    }),
  );
};

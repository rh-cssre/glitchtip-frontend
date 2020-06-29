import { Injectable, ErrorHandler } from "@angular/core";
import * as Sentry from "@sentry/browser";
import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";

type HandledError =
  | Error
  | string
  | HttpErrorResponse
  | ErrorEvent
  | { ngOriginalError: HandledError };

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  extractError(error: HandledError) {
    // Try to unwrap zone.js error.
    // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
    if (
      error &&
      typeof error === "object" &&
      !(error instanceof Error) &&
      !(error instanceof HttpErrorResponse) &&
      !(error instanceof ErrorEvent) &&
      error.ngOriginalError
    ) {
      error = error.ngOriginalError;
    }

    // We can handle messages and Error objects directly.
    if (typeof error === "string" || error instanceof Error) {
      return error;
    }

    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      // The `error` property of http exception can be either an `Error` object, which we can use directly...
      if (error.error instanceof Error) {
        return error.error;
      }

      // ... or an`ErrorEvent`, which can provide us with the message but no stack...
      if (error.error instanceof ErrorEvent) {
        return error.error.message;
      }

      // ...or the request body itself, which we can use as a message instead.
      if (typeof error.error === "string") {
        return `Server returned code ${error.status} with body "${error.error}"`;
      }

      // If we don't have any detailed information, fallback to the request message itself.
      return error.message;
    }
    // Skip if there's no error, and let user decide what to do with it.
    return null;
  }

  handleError(error: HandledError) {
    if (environment.production) {
      Sentry.captureException(error);
    }
    console.error(error);
  }
}

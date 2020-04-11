import { Injectable, ErrorHandler } from "@angular/core";
import * as Sentry from "@sentry/browser";
import { environment } from "src/environments/environment";

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error) {
    if (environment.production) {
      Sentry.captureException(error.originalError || error);
    }
    console.error(error);
  }
}

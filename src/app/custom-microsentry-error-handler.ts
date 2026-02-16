import { ErrorHandler, Injectable, inject } from "@angular/core";
import { MicroSentryErrorBusService } from "@micro-sentry/angular";
import { MicroSentryService } from "@micro-sentry/angular";

@Injectable({ providedIn: "root" })
export class CustomMicroSentryErrorHandler implements ErrorHandler {
  private errorBus = inject(MicroSentryErrorBusService);

  constructor() {
    const errorBus = this.errorBus;
    const microSentry = inject(MicroSentryService);

    errorBus.errors$.subscribe((error) => {
      microSentry.report(error as Error);
    });
  }

  handleError(error: Error): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(error.message)) {
      if (confirm($localize`New version available. Load New Version?`)) {
        window.location.reload();
      }
    } else {
      this.errorBus.next(error);
      console.error(error);
    }
  }
}

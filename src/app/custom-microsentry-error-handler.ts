import { ErrorHandler, Injectable, inject } from "@angular/core";
import { MicroSentryErrorBusService } from "@micro-sentry/angular";
import { MicroSentryService } from "@micro-sentry/angular";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

@Injectable({ providedIn: "root" })
export class CustomMicroSentryErrorHandler implements ErrorHandler {
  private errorBus = inject(MicroSentryErrorBusService);
  dialog = inject(MatDialog);

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
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: $localize`Load new version?`,
          message: $localize`New version available. Load New Version?`,
          confirmText: $localize`Load`,
          destructive: false
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          window.location.reload();
        }
      });
    } else {
      this.errorBus.next(error);
      console.error(error);
    }
  }
}

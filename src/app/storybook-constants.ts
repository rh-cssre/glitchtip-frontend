import { importProvidersFrom } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MicroSentryModule } from "@micro-sentry/angular";
import { applicationConfig } from "@storybook/angular";

export const basePage = {
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(MatSnackBarModule),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(RouterTestingModule),
        importProvidersFrom(NoopAnimationsModule),
        importProvidersFrom(MicroSentryModule.forRoot({})),
      ],
    }),
  ],
};

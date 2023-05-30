import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/legacy-snack-bar";
import { MicroSentryModule } from "@micro-sentry/angular";

import { AppComponent } from "./app.component";
import { TokenInterceptor } from "./api/auth/token.interceptor";

// Modules
import { AppRoutingModule } from "./app-routing.module";
import { RateLimitBannerComponent } from "./rate-limit-banner/rate-limit-banner.component";
import { GlobalErrorHandler } from "./global-error-handler";
import { MainNavComponent } from "./main-nav/main-nav/main-nav.component";
import { ErrorStateMatcher } from "@angular/material/core";
import { LessAnnoyingErrorStateMatcher } from "./shared/less-annoying-error-state-matcher";

let snackBarDuration = 4000;
if (window.Cypress) {
  // Speed up cypress tests
  snackBarDuration = 100;
}

const serverErrorsRegex = new RegExp(`403 Forbidden|404 OK`, "mi");

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RateLimitBannerComponent,
    MainNavComponent,
    MatSnackBarModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: "csrftoken",
      headerName: "X-CSRFTOKEN",
    }),
    MicroSentryModule.forRoot({ ignoreErrors: [serverErrorsRegex] }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: snackBarDuration },
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: ErrorStateMatcher,
      useClass: LessAnnoyingErrorStateMatcher,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import * as Sentry from "@sentry/angular";

import { AppComponent } from "./app.component";
import { TokenInterceptor } from "./api/auth/token.interceptor";

// Modules
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./api/auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { MainNavModule } from "./main-nav/main-nav.module";
import { RateLimitBannerComponent } from "./rate-limit-banner/rate-limit-banner.component";

@NgModule({
  declarations: [AppComponent, RateLimitBannerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: "csrftoken",
      headerName: "X-CSRFTOKEN",
    }),
    MainNavModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

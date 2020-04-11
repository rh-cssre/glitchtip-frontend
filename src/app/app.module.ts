import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { OAuthModule } from "angular-oauth2-oidc";
import { MatomoModule } from "ngx-matomo";

import { AppComponent } from "./app.component";
import { TokenInterceptor } from "./api/auth/token.interceptor";
import { SentryErrorHandler } from "./error-handler";

// Modules
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./api/auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { MainNavModule } from "./main-nav/main-nav.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    MatomoModule,
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
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from "@angular/core";
import { loadTranslations } from "@angular/localize";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { MicroSentryModule } from "@micro-sentry/angular";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { provideAnimations } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app/app-routing.module";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { LessAnnoyingErrorStateMatcher } from "./app/shared/less-annoying-error-state-matcher";
import { ErrorStateMatcher } from "@angular/material/core";
import { GlobalErrorHandler } from "./app/global-error-handler";
import { MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/legacy-snack-bar";
import { TokenInterceptor } from "./app/api/auth/token.interceptor";
import {
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
  provideHttpClient,
  HttpClientXsrfModule,
} from "@angular/common/http";

let snackBarDuration = 4000;
if (window.Cypress) {
  // Speed up cypress tests
  snackBarDuration = 100;
}
const serverErrorsRegex = new RegExp(`403 Forbidden|404 OK`, "mi");

if (environment.production) {
  enableProdMode();
}

// First locale is default, add additional after it
const availableLocales = ["en", "fr", "nb"];
// Direct macrolanguages to specific ones. Example: Norwegian becomes Bokmål
const localeMappings: { [key: string]: string } = { no: "nb" };

let locale =
  availableLocales.find((l) => navigator.language.startsWith(l)) ??
  availableLocales[0];
window.document.documentElement.lang = locale;

if (locale in localeMappings) {
  locale = localeMappings[locale];
}

if (locale === availableLocales[0]) {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(
        BrowserModule,
        AppRoutingModule,
        MatSnackBarModule,
        HttpClientXsrfModule.withOptions({
          cookieName: "csrftoken",
          headerName: "X-CSRFTOKEN",
        }),
        MicroSentryModule.forRoot({ ignoreErrors: [serverErrorsRegex] })
      ),
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
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
    ],
  }).catch((err) => console.error(err));
} else {
  // fetch resources for runtime translations. this could also point to an API endpoint
  fetch(`static/assets/i18n/messages.${locale}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return response.json();
    })
    .then((result) => {
      loadTranslations(result);

      bootstrapApplication(AppComponent, {
        providers: [
          importProvidersFrom(
            BrowserModule,
            AppRoutingModule,
            MatSnackBarModule,
            HttpClientXsrfModule.withOptions({
              cookieName: "csrftoken",
              headerName: "X-CSRFTOKEN",
            }),
            MicroSentryModule.forRoot({ ignoreErrors: [serverErrorsRegex] })
          ),
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
          provideAnimations(),
          provideHttpClient(withInterceptorsFromDi()),
        ],
      }).catch((err) => console.error(err));
    });
}

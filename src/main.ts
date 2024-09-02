import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from "@angular/core";
import { loadTranslations } from "@angular/localize";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { MicroSentryModule } from "@micro-sentry/angular";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { routes, TemplatePageTitleStrategy } from "./app/app.routes";
import { bootstrapApplication } from "@angular/platform-browser";
import { LessAnnoyingErrorStateMatcher } from "./app/shared/less-annoying-error-state-matcher";
import { ErrorStateMatcher } from "@angular/material/core";
import { CustomMicroSentryErrorHandler } from "./app/custom-microsentry-error-handler";
import { tokenInterceptor } from "./app/api/auth/token.interceptor";
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from "@angular/common/http";
import {
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from "@angular/router";
import { CustomPreloadingStrategy } from "./app/preloadingStrategy";

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

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(
        routes,
        withPreloading(CustomPreloadingStrategy),
        withInMemoryScrolling({
          scrollPositionRestoration: "enabled",
        }),
        withRouterConfig({
          onSameUrlNavigation: "reload",
          paramsInheritanceStrategy: "always",
        })
      ),
      importProvidersFrom(
        MatSnackBarModule,
        MicroSentryModule.forRoot({ ignoreErrors: [serverErrorsRegex] })
      ),
      {
        provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
        useValue: { duration: snackBarDuration },
      },
      { provide: ErrorHandler, useClass: CustomMicroSentryErrorHandler },
      { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
      {
        provide: ErrorStateMatcher,
        useClass: LessAnnoyingErrorStateMatcher,
      },
      provideAnimationsAsync(),
      provideHttpClient(
        withXsrfConfiguration({
          cookieName: "csrftoken",
          headerName: "X-CSRFTOKEN",
        }),
        withInterceptors([tokenInterceptor])
      ),
    ],
  }).catch((err) => console.error(err));

if (locale === availableLocales[0]) {
  bootstrap();
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

      bootstrap();
    });
}

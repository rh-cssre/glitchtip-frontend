import {
  ErrorHandler,
  inject,
  provideZonelessChangeDetection,
  Provider,
} from "@angular/core";
import { loadTranslations } from "@angular/localize";

import { AppComponent } from "./app/app.component";
import { provideMicroSentry } from "@micro-sentry/angular";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { routes, TemplatePageTitleStrategy } from "./app/app.routes";
import { bootstrapApplication } from "@angular/platform-browser";
import { LessAnnoyingErrorStateMatcher } from "./app/shared/less-annoying-error-state-matcher";
import { ErrorStateMatcher } from "@angular/material/core";
import { CustomMicroSentryErrorHandler } from "./app/custom-microsentry-error-handler";
import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from "@angular/router";
import { CustomPreloadingStrategy } from "./app/preloadingStrategy";
import { APP_BASE_HREF } from "@angular/common";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

let snackBarDuration = 4000;
if (window.Cypress) {
  // Speed up cypress tests
  snackBarDuration = 100;
}
const serverErrorsRegex = new RegExp(`403 Forbidden|404 OK`, "mi");

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

export function baseHrefInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const baseHref = inject(APP_BASE_HREF);
  const apiReq = req.clone({ url: `${baseHref.replace(/\/$/, "")}${req.url}` });
  return next(apiReq);
}

const extraInterceptors: HttpInterceptorFn[] = [];
const extraProviders: Provider[] = [];

const baseElement = document.querySelector("base");
if (baseElement) {
  const baseHref = baseElement.href;
  // Only add base href support when it's not "/"
  if (baseHref !== "/") {
    extraProviders.push({ provide: APP_BASE_HREF, useValue: baseHref });
    extraInterceptors.push(baseHrefInterceptor);
  }
}

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      ...extraProviders,
      provideZonelessChangeDetection(),
      provideAnimationsAsync(), // ngx-charts uses this, should be removed
      provideRouter(
        routes,
        withComponentInputBinding(),
        withPreloading(CustomPreloadingStrategy),
        withInMemoryScrolling({
          scrollPositionRestoration: "enabled",
        }),
        withRouterConfig({
          onSameUrlNavigation: "reload",
          paramsInheritanceStrategy: "always",
        }),
      ),
      provideHttpClient(withInterceptors([...extraInterceptors])),
      provideMicroSentry({
        ignoreErrors: [serverErrorsRegex],
      }),
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

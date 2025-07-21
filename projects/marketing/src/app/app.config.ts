import {
  ApplicationConfig,
  provideZoneChangeDetection,
  SecurityContext,
} from "@angular/core";
import {
  provideRouter,
  withInMemoryScrolling,
  InMemoryScrollingOptions,
  InMemoryScrollingFeature,
} from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideMarkdown } from "ngx-markdown";
import { provideHttpClient, withFetch } from "@angular/common/http";

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: "top",
  anchorScrolling: "enabled",
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, inMemoryScrollingFeature),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideMarkdown({
      // Necessary so attributes don't get scrubbed from html elements
      sanitize: SecurityContext.STYLE,
    }),
    provideClientHydration(),
  ],
};

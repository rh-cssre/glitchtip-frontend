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
  TitleStrategy,
} from "@angular/router";

import { routes } from "./app.routes";
import { SeoTitleStrategy } from "./shared/seo-title-strategy";
import {
  provideClientHydration,
  withNoIncrementalHydration,
} from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideMarkdown } from "ngx-markdown";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { SANITIZE } from "ngx-markdown";

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
      sanitize: {
        provide: SANITIZE,
        useValue: SecurityContext.STYLE,
      },
    }),
    provideClientHydration(withNoIncrementalHydration()),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
  ],
};

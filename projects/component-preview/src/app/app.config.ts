import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    // Router enables previewed components using routerLink (e.g.
    // project-card) and the shell's ?p= deep links. The single match-all
    // route renders nothing; the shell reads the query param itself.
    provideRouter([{ path: "**", children: [] }]),
  ],
};

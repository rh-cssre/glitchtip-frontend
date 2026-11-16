import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    // Router enables previewed components using routerLink (e.g.
    // list rows) and the shell's ?p= deep links. The single match-all
    // route renders nothing; the shell reads the query param itself.
    provideRouter([{ path: "**", children: [] }]),
  ],
};

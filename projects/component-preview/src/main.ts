// Type-side import: pulls in @angular/localize's `declare global` so app
// components using $localize (e.g. confirm-dialog) type-check here, the same
// way the main app gets it via its own @angular/localize import. The runtime
// $localize function itself comes from the "@angular/localize/init" polyfill.
import "@angular/localize";
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);

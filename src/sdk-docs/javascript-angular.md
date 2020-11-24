On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.

Additionally, `@sentry/browser` can be configured to catch any Angular-specific (2.x) exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component. This is also a great opportunity to collect user feedback by using `GlitchTip.showReportDialog`.

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler, Injectable } from "@angular/core";

import { AppComponent } from "./app.component";

import * as GlitchTip from "@sentry/browser";

GlitchTip.init({
  dsn: "your DSN here",
});

@Injectable()
export class GlitchTipErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = GlitchTip.captureException(error.originalError || error);
    GlitchTip.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{ provide: ErrorHandler, useClass: GlitchTipErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

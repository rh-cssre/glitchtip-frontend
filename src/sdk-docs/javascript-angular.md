GlitchTip recommends using [@micro-sentry/angular](https://github.com/taiga-family/micro-sentry). Alternatively, users who want performance data need to use `@sentry/angular`.

# @micro-sentry

@micro-sentry features a very small bundle size and is easy to configure.

Install `@micro-sentry/angular`:

```bash
npm install @micro-sentry/angular
```

In `app.module.ts` add MicroSentryModule with your GlitchTip DSN.

```javascript
import { MicroSentryModule } from '@micro-sentry/angular';

@NgModule({
  imports: [
    MicroSentryModule.forRoot({
      dsn: "YOUR_DSN",
    }),
  ],
})
```

# @sentry/angular

@sentry/angular has more features including performance tracking. The package adds up to [578 KB](https://bundlephobia.com/result?p=@sentry/angular) to your JS bundle size.

Install `@sentry/angular`:

```bash
npm install @sentry/angular
```

Initialize the SDK in your `main.ts` **before** bootstrapping the app:

```typescript
import { ErrorHandler } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import * as Sentry from "@sentry/angular";
import { AppComponent } from "./app/app.component";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions — adjust to your needs
  autoSessionTracking: false, // GlitchTip does not support sessions
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
  ],
});
```

Providing `Sentry.createErrorHandler()` as the Angular `ErrorHandler` ensures component errors are captured automatically.

## Source Maps

Upload source maps for readable stack traces. Use the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli sourcemaps inject ./dist
glitchtip-cli sourcemaps upload ./dist --org my-org --project my-project
```

## Tips

- Set `tracesSampleRate` to a low value in production to save disk space.
- Use `release` and `environment` options to track which deployments introduce errors.

To use GlitchTip with your Vue application, you will need to use the `@sentry/vue` SDK.

```bash
# Using yarn
$ yarn add @sentry/vue

# Using npm
$ npm install @sentry/vue --save
```

On its own, `@sentry/vue` will report any uncaught exceptions triggered by your application.

Additionally, the Vue _integration_ will capture the name and props state of the active component where the error was thrown. This is reported via Vue’s `config.errorHandler` hook.

Then add this to your `app.js`:

```javascript
import Vue from "vue";
import * as Sentry from "@sentry/vue";

Sentry.init({
  dsn: "YOUR-GLITCHTIP-DSN-HERE",
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    tracesSampleRate: 0.01,
  ],
  environment: "dev or prod",
  release = 'release tag'
});
```

```

Vue-Specific configuration
The SDK accepts a few Vue-specific Sentry.init configuration options:

attachProps (defaults to true) - Includes all Vue components' props with the events.
logErrors (defaults to true) - Decides whether SDK should call Vue's original logError function as well.
Check out how to Track Vue Components for performance.

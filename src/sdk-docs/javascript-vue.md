Install the sentry Vue SDK:

```bash
npm install @sentry/vue
```

Initialize the SDK in your `main.ts` (or `main.js`), passing the Vue app instance:

```javascript
import { createApp } from "vue";
import * as Sentry from "@sentry/vue";
import App from "./App.vue";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions — adjust to your needs
  autoSessionTracking: false, // GlitchTip does not support sessions
});

app.mount("#app");
```

The SDK captures component errors via Vue's `config.errorHandler` hook, including the component name and props.

Verify your setup by throwing an error in any component method.

## Source Maps

Upload source maps for readable stack traces. Use the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli sourcemaps inject ./dist
glitchtip-cli sourcemaps upload ./dist --org my-org --project my-project
```

## Tips

- The SDK automatically captures component name and props with each error event.
- Set `tracesSampleRate` to a low value in production to save disk space.

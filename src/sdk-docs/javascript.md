Install the sentry browser SDK:

```bash
npm install @sentry/browser
```

Initialize the SDK as early as possible during page load:

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions — adjust to your needs
  autoSessionTracking: false, // GlitchTip does not support sessions
});
```

Verify your setup by triggering a test error:

```javascript
myUndefinedFunction();
```

## Source Maps

Upload source maps for readable stack traces in production. Use the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli sourcemaps inject ./dist
glitchtip-cli sourcemaps upload ./dist --org my-org --project my-project
```

## Tips

- Set `tracesSampleRate` to a low value in production to save disk space. Most teams find 1–10% sufficient for useful [performance data](/documentation/performance).
- Use `release` and `environment` options to track which deployments introduce errors.

Install the sentry Electron SDK:

```bash
npm install @sentry/electron
```

Initialize the SDK in both your `main` process and every `renderer` process:

```javascript
import * as Sentry from "@sentry/electron";

Sentry.init({
  dsn: "YOUR_DSN",
  autoSessionTracking: false, // GlitchTip does not support sessions
});
```

Verify your setup:

```javascript
myUndefinedFunction();
```

Test this in both your `main` and `renderer` processes to verify the SDK is operational in both.

## Tips

- The SDK captures crashes from both the main process and renderer processes.
- Upload debug symbols with the [GlitchTip CLI](/documentation/cli) for readable native crash stack traces.

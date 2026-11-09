Install the sentry React Native SDK:

```bash
npm install @sentry/react-native
```

Initialize the SDK as early as possible (e.g., in `index.js` or `App.js`):

```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions
  autoSessionTracking: false, // GlitchTip does not support sessions
});
```

The SDK captures JavaScript errors, native crashes (iOS and Android), and unhandled promise rejections.

Verify your setup:

```javascript
Sentry.captureException(new Error("Test GlitchTip error!"));
```

## Debug Symbols

Upload native debug symbols for readable crash stack traces using the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli debug-files upload ./ios/build --org my-org --project my-project
```

## Tips

- Set `tracesSampleRate` to a low value. Mobile apps can generate many transactions.

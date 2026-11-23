Install the sentry Node.js SDK:

```bash
npm install @sentry/node
```

Initialize the SDK **before** any other imports or app setup:

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions — adjust to your needs
  autoSessionTracking: false, // GlitchTip does not support sessions
});

const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello world!");
});

// The Sentry error handler must be registered before any other error middleware
Sentry.setupExpressErrorHandler(app);

app.listen(3000);
```

The SDK auto-instruments Express routes and captures unhandled errors.

Verify your setup:

```javascript
app.get("/debug-glitchtip", function (req, res) {
  throw new Error("Test GlitchTip error!");
});
```

## Tips

- Set `tracesSampleRate` to a low value in production. Each HTTP request is a transaction — even 1% gives useful [performance data](/documentation/performance).
- Use `release` and `environment` options to track deployments.

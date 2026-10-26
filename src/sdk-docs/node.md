Install the sentry Node.js SDK:

```bash
npm install @sentry/node
```

Initialize the SDK as early as possible in your application:

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions — adjust to your needs
  autoSessionTracking: false, // GlitchTip does not support sessions
});
```

Verify your setup:

```javascript
Sentry.captureMessage("Test message from Node.js");
```

Or trigger a test error:

```javascript
myUndefinedFunction();
```

## Tips

- If you're using Express, Koa, or Connect, see their dedicated integration docs for richer error context.
- Set `tracesSampleRate` to a low value in production to save disk space.

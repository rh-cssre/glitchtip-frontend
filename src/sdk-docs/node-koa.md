Install the sentry Node.js SDK:

```bash
npm install @sentry/node
```

Initialize the SDK before creating your Koa app:

```javascript
const Koa = require("koa");
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01,
  autoSessionTracking: false,
});

const app = new Koa();

app.on("error", (err, ctx) => {
  Sentry.withScope((scope) => {
    scope.setSDKProcessingMetadata({ request: ctx.request });
    Sentry.captureException(err);
  });
});

app.listen(3000);
```

Verify your setup:

```javascript
app.use(async (ctx) => {
  throw new Error("Test GlitchTip error!");
});
```

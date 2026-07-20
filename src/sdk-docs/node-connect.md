Install the sentry Node.js SDK:

```bash
npm install @sentry/node
```

Initialize the SDK before creating your Connect app:

```javascript
const connect = require("connect");
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01,
  autoSessionTracking: false,
});

const app = connect();

app.use(function (req, res) {
  res.end("Hello world!");
});

app.listen(3000);
```

The SDK auto-detects Connect and captures unhandled errors.

Verify your setup:

```javascript
app.use(function (req, res) {
  throw new Error("Test GlitchTip error!");
});
```

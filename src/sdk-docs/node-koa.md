The Koa integration requires the installation of `@sentry/node`. Then, you can use it like this:

```javascript
const Koa = require("koa");
const app = new Koa();
const Sentry = require("@sentry/node");

Sentry.init({ dsn: "YOUR-GLITCHTIP-DSN-HERE" });

app.on("error", (err, ctx) => {
  Sentry.withScope(function (scope) {
    scope.addEventProcessor(function (event) {
      return Sentry.Handlers.parseRequest(event, ctx.request);
    });
    Sentry.captureException(err);
  });
});

app.listen(3000);
```

Our Koa integration only requires the installation of `@sentry/node`, and then you can use it like this:

```javascript
const Koa = require("koa");
const app = new Koa();
const GlitchTip = require("@sentry/node");

GlitchTip.init({ dsn: "your DSN here" });

app.on("error", (err, ctx) => {
  GlitchTip.withScope(function (scope) {
    scope.addEventProcessor(function (event) {
      return GlitchTip.Handlers.parseRequest(event, ctx.request);
    });
    GlitchTip.captureException(err);
  });
});

app.listen(3000);
```

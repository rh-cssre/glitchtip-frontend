Install `@sentry/nextjs` into your Next.js project:

```bash
npm install --save @sentry/nextjs
```

Create two configuration files for both client (browser) and server (node).

`sentry.server.config.js` and `sentry.client.config.js` (or .ts for TypeScript).

Both files may contain the same values, or be set differently.

```javascript
import * as Sentry from "@sentry/nextjs";
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn: SENTRY_DSN || "YOUR DSN HERE",
});
```

Next update (or create) your [next.config.js](https://nextjs.org/docs/api-reference/next.config.js/introduction) file to wrap exports with withSentryConfig.

```javascript
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = (phase, { defaultConfig }) => {
  const nextConfig = {};
  return nextConfig;
};

module.exports = withSentryConfig(moduleExports);
```

To support Next.js API routes, wrap the routes as seen here.

```javascript
import { withSentry } from "@sentry/nextjs";

function handler(req, res) {
  res.status(200).json({ bar: "foo" });
}

export default withSentry(handler);
```

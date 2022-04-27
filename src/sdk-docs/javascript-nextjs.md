Install `@sentry/nextjs` into your Next.js project:

```bash
npm install --save @sentry/nextjs
```

Run the Sentry Wizard and provide your GlitchTip URL:

```bash
npx @sentry/wizard --url=https://your-server-url
```

Once you have chosen the GlitchTip project you wish to connect to, the wizard will create two config files:

`sentry.server.config.js` and `sentry.client.config.js` (or .ts for TypeScript)

Add your GlitchTip DSN. Both files may contain the same values, or be set differently.

```javascript
import * as Sentry from "@sentry/nextjs";
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn: SENTRY_DSN || "YOUR DSN HERE",
});
```

Next update your [next.config.js](https://nextjs.org/docs/api-reference/next.config.js/introduction) file to wrap exports and `sentryWebpackPluginOptions` with `withSentryConfig`. Assuming you already have a config file, the wizard will create another one with the relevant code for you to merge.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  nextConfig,
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
```

## Sourcemaps

Once you have connected your project with GlitchTip, your sourcemaps will be uploaded automatically whenever you run build.

## Performance Monitoring

You can send performance transactions to GlitchTip to monitor your app's speed. In your `sentry.server.config.js` and `sentry.client.config.js` files, set the `tracesSampleRate` variable to a number between 0 and 1. This will determine what percentage of transactions are sent to GlitchTip.

```javascript
import * as Sentry from "@sentry/nextjs";
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn: SENTRY_DSN || "YOUR DSN HERE",
  tracesSampleRate: 0.1,
});
```

## Configuration

To support Next.js API routes, wrap the routes as seen here.

```javascript
import { withSentry } from "@sentry/nextjs";

function handler(req, res) {
  res.status(200).json({ bar: "foo" });
}

export default withSentry(handler);
```

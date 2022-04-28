Install `@sentry/nextjs` into your Next.js project:

```bash
npm install --save @sentry/nextjs
```

Run the Sentry Wizard and provide your GlitchTip URL:

```bash
npx @sentry/wizard --url=https://your-server-url
```

### Try it out

Following the wizard's instructions will connect your app to GlitchTip. You can verify GlitchTip is now monitoring your app by adding a link that will generate a simple error:

```html
<button
  onClick={() => {
    throw Error("Generic Error Message");
  }}
  className={styles.card}
>
  Generic Error Message
</button>
```

Then check your GlitchTip Issues page to see the error.

# Configuration

SDK options are set in two separate config files:

`sentry.server.config.js` and `sentry.client.config.js` (or .ts for TypeScript)

Both files may contain the same values, or be set differently.

```javascript
import * as Sentry from "@sentry/nextjs";
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn: SENTRY_DSN || "YOUR GLITCHTIP DSN HERE",
});
```

Configuration options include:

- dsn - Where to send event data to, found in GlitchTip in project settings.
- release - For versioning the source maps that are uploaded when you run build for your project. An arbitrary release ID will be generated automatically, but you may choose to determine the name through an environment variable.
- environment - The running environment name, such as "production". Set to `process.env.NODE_ENV` by default.
- sampleRate - Percent of error events to send to GlitchTip. 0.5 would be 50%. Defaults to 1.0.
- tracesSampleRate - Percent of performance transactions to send to GlitchTip, set to a number betweeon 0 and 1. 0.01 would be 1%. We recommend a lower value to save costs/hard drive space.

## Performance Monitoring

You can send performance transactions to GlitchTip to monitor your app's speed. In your `sentry.server.config.js` and `sentry.client.config.js` files, set the `tracesSampleRate` variable to a number between 0 and 1. This will determine what percentage of transactions are sent to GlitchTip.

```javascript
import * as Sentry from "@sentry/nextjs";
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn: SENTRY_DSN || "YOUR GLITCHTIP DSN HERE",
  tracesSampleRate: 0.1,
});
```

## API routes

To support Next.js API routes, wrap the routes in your `next.config.js` file as seen here.

```javascript
import { withSentry } from "@sentry/nextjs";

function handler(req, res) {
  res.status(200).json({ bar: "foo" });
}

export default withSentry(handler);
```

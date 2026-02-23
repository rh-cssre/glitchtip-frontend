## Installation guide

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
<button onClick="{()" =""> { throw Error("Generic Error Message"); }} className={styles.card} > Generic Error Message </button>
```

Then check your GlitchTip Issues page to see the error.

## Configuration

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

## How to set up client tunnel

Sometimes client side error reporting could be blocked by 3rd party tools. To solve this, you need to set up a client tunnel through your own API route.

You must set up the endpoint with a tunnel yourself. This is only needed for client as server and edge errors will be sent from serverside avoiding this issue.

### Steps to create a tunnel:

1. Create an API route in your Next.js project
2. Configure client to use this tunnel

Here is a minimal example of an API route for Pages router:

```javascript
// pages/api/glitchtip-tunnel.js
export default async function handler(req, res) {
  const url = `${YOUR_SERVER_INSTANCE}/api/${YOUR_PROJECT_ID}/envelope/?sentry_version=7&sentry_key=${YOUR_SECRET_KEY}&sentry_client=sentry.javascript.nextjs%2F9.2.0`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Accept: "*/*",
      },
      body: req.body,
    });

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("GlitchTip tunnel error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}
```

### Required variables:

- `YOUR_SERVER_INSTANCE`: URL of your GlitchTip instance (e.g., `https://app.glitchtip.com`). Be careful with trailing slashes!

- `YOUR_PROJECT_ID`: Your project ID number. Find it in your project URL. Example: if your URL is `https://app.glitchtip.com/your-organization/issues?project=1`, then your ID is `1`.

- `YOUR_SECRET_KEY`: Found in your Security Endpoint in the `glitchtip_key` query parameter. Example: if your security URL is `https://app.glitchtip.com/api/1/security/?glitchtip_key=123ab12ab1234a1abcde12abcdef123a`, then your key is `123ab12ab1234a1abcde12abcdef123a`.

### Configure client to use your tunnel:

In your `sentry.client.config.js` file, add the tunnel option:

```javascript
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1,
  tunnel: "/api/glitchtip-tunnel", // Path to your API route
});
```

This will route all error reports through your own API endpoint, bypassing ad blockers.

## Automatic upload of source maps on build

You will need to set `productionBrowserSourceMaps: true` in your `next.config.js` (or .ts for TypeScript) in order for Next.js to keep the source maps and automatically trigger uploading of source maps on build using SentrySDK. Then you need to pass parameters into `withSentryConfig`. This works for Vercel builds as well without setting up Sentry integration.

**Here is an example:**

```javascript
withSentryConfig(module.exports, {
  authToken: YOUR_AUTH_TOKEN,
  org: YOUR_ORGANIZATION_SLUG,
  project: YOUR_PROJECT_SLUG,
  sentryUrl: YOUR_SERVER_INSTANCE,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
});
```

- `YOUR_AUTH_TOKEN` - Token that you can generate in profile section.

- `YOUR_ORGANIZATION_SLUG` - Could be found in your glitchtip url. Usually it is lowercase name of organization where spaces replaced with dashes.

- `YOUR_PROJECT_SLUG` - This is a bit trickier to find. Usually it's a lowercase name of your project with dashes instead of spaces. You can use api endpoint to list all your projects with their names `/api/0/projects/`. You will need to use your `YOUR_AUTH_TOKEN` to authorize the request.

- `YOUR_SERVER_INSTANCE` - Same as before, it's a url of your instance.

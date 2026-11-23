Install the sentry Next.js SDK:

```bash
npm install @sentry/nextjs
```

## Configuration

Next.js requires separate config files for client, server, and edge runtimes.

Create `sentry.client.config.js`:

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01,
  autoSessionTracking: false,
});
```

Create `sentry.server.config.js`:

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01,
});
```

Create `instrumentation.ts` to load the server config:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
```

## Source Maps

Upload source maps for readable stack traces. In `next.config.js`:

```javascript
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: "your-org",
  project: "your-project",
  sentryUrl: "https://your-glitchtip.example.com",
});
```

Or upload manually with the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli sourcemaps inject .next
glitchtip-cli sourcemaps upload .next --org my-org --project my-project
```

## Client Tunnel

If ad blockers interfere with error reporting, route events through your own API:

Create `pages/api/glitchtip-tunnel.js` (or use App Router):

```javascript
export default async function handler(req, res) {
  const dsn = new URL("YOUR_DSN");
  const projectId = dsn.pathname.replace("/", "");
  const url = `${dsn.protocol}//${dsn.host}/api/${projectId}/envelope/`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: req.body,
  });

  res.status(200).json({ status: "ok" });
}
```

Then add `tunnel: "/api/glitchtip-tunnel"` to your client config.

## Tips

- Set `tracesSampleRate` to a low value in production to save disk space.
- The SDK handles both server-side and client-side errors automatically.

Install the sentry React SDK:

```bash
npm install @sentry/react
```

Initialize the SDK **before** mounting your React app:

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.01, // 1% of transactions — adjust to your needs
  autoSessionTracking: false, // GlitchTip does not support sessions
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

The SDK automatically captures unhandled exceptions and promise rejections.

Verify your setup:

```jsx
<button onClick={() => { throw new Error("Test GlitchTip error"); }}>
  Test Error
</button>
```

## Error Boundary

Wrap components with `Sentry.ErrorBoundary` to catch rendering errors:

```jsx
<Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <MyComponent />
</Sentry.ErrorBoundary>
```

## Source Maps

Upload source maps for readable stack traces. Use the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli sourcemaps inject ./dist
glitchtip-cli sourcemaps upload ./dist --org my-org --project my-project
```

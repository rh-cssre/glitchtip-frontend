To use GlitchTip with your React application, you will need to use the `@sentry/browser` SDK.

Add the SDK as a dependency using `yarn` or `npm`:

### Installation

```bash
# Using yarn
$ yarn add @sentry/browser

# Using npm
$ npm install @sentry/browser
```

### Connecting the SDK to GlitchTip

You should `init` the browser SDK as soon as possible during your application load up, before initializing React:

```jsx
import React from "react";
import * as Sentry from "@sentry/browser";
import App from "src/App";

Sentry.init({ dsn: "YOUR-GLITCHTIP-DSN-HERE" });

ReactDOM.render(<App />, document.getElementById("root"));
```

On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button:

```jsx
return <button onClick={methodDoesNotExist}>Break the world</button>;
```

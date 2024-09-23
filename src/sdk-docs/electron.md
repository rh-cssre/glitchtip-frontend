If you are using `yarn` or `npm` you can add the SDK as a dependency:

```bash
# Using yarn
$ yarn add @sentry/electron

# Using npm
$ npm install @sentry/electron
```

You need to call `init` in your `main` and every `renderer` process you spawn.
For more details about Electron [click here]({%- link _documentation/platforms/javascript/electron.md -%})

```javascript
import * as Sentry from "@sentry/electron";

Sentry.init({ dsn: "YOUR-GLITCHTIP-DSN-HERE" });
```

One way to break your Electron application is to call an undefined function:

```javascript
myUndefinedFunction();
```

You may want to try inserting this into both your `main` and any `renderer` processes to verify the SDK is operational in both.

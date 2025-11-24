Use `yarn` or `npm` to add `@sentry/node` to your project:

```bash
# Using yarn
$ yarn add @sentry/node

# Using npm
$ npm install @sentry/node
```

Then, inform the Node SDK about your DSN:

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "YOUR-GLITCHTIP-DSN-HERE" });
```

One way to break your JavaScript application is to call an undefined function:

```js
myUndefinedFunction();
```

If you are using `yarn` or `npm` you can add our package as a dependency:

```bash
# Using yarn
$ yarn add @sentry/node

# Using npm
$ npm install @sentry/node
```

You need to inform the Node SDK about your DSN:

```javascript
const GlitchTip = require("@sentry/node");
GlitchTip.init({ dsn: "your DSN here" });
```

One way to break your JavaScript application is to call an undefined function:

```js
myUndefinedFunction();
```

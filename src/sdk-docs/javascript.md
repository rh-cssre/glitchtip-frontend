The simplest way to send an event to GlitchTip is to paste this into your HTML file somewhere:

```html
<script
  src="https://unpkg.com/@sentry/browser@latest/build/bundle.min.js"
  crossorigin="anonymous"
></script>

<script>
  Sentry.init({ dsn: "your DSN here" });

  undefinedFunction();
</script>
```

First, install the SDK. This code sample uses [unpkg](https://unpkg.com), but you can save that file and use it locally, or install with NPM by running `npm i @sentry/browser`.

Then, initialize the SDK as shown above, using your DSN. Do this as early as possible in your loading sequence so it can capture errors from the start.

If you've properly added and initialized the SDK, it should capture all of your errors without any further configuration.

If you want to throw errors more manually, you can do that as well. Here's an example:

```javascript
try {
  someFunction();
} catch (error) {
  Sentry.captureException(error);
}
```

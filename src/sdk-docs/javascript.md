GlitchTip is an open-source alternative to Sentry that works seamlessly with the Sentry browser SDK.

## Step 1: Include the SDK via CDN or NPM

To get started, you have two options for including the Sentry SDK:

### Option 1: CDN

Add the following script tag to your HTML file.

```html
<script src="https://browser.sentry-cdn.com/7.60.0/bundle.min.js" crossorigin="anonymous"></script>
```

Consider checking the Sentry GitHub repository for the latest available version number.

### Option 2: NPM

If you prefer using NPM for managing dependencies, you can install the Sentry SDK like this:

```bash
npm install @sentry/browser
```

## Step 2: Initialize the SDK

Next, initialize the Sentry SDK as early as possible during your page load. Retrieve your DSN from your Glitchtip project settings and use it to configure the SDK. Additionally, you can set the `tracesSampleRate` option to specify the rate at which performance monitoring data should be sent (e.g., `0.01` for 1% of transactions).

```javascript
Sentry.init({
  dsn: "YOUR-GLITCHTIP-DSN-HERE",
  tracesSampleRate: 0.01,
});
```

## Step 3: Verify Error Reporting

To ensure that error reporting works correctly, you can create a simple test by calling an undefined function:

```javascript
myUndefinedFunction();
```

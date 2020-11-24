The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```html
<script
  src="https://browser.sentry-cdn.com/5.5.0/bundle.min.js"
  crossorigin="anonymous"
></script>
```

You should init the Browser SDK as soon as possible during your page load:

```javascript
Sentry.init({
  dsn: "your DSN here",
});
```

One way to break your JavaScript application is to call an undefined function:

```javascript
myUndefinedFunction();
```

You can verify the function caused an error by checking your browser console.

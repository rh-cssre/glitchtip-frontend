`@sentry/angular` can be used to catch any Angular-specific exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component.

Install `@angular/angular`:

```bash
$ npm install --save @sentry/angular
```

For best results, add this snippet to your main.ts. If you need to set the DSN dynamically, you may set this elsewhere as well.

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "your GlitchTip DSN here",
});
```

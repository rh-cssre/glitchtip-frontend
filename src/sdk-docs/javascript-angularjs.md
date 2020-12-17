If you are using `AngularJS` `1.x` you should be able to use the AngularJS integration.

You need to install `@sentry/integrations` with `npm` / `yarn` like:

```bash
npm install @sentry/integrations
# or
yarn add @sentry/integrations
```

```javascript
import angular from "angular";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

// Make sure to call Sentry.init after importing AngularJS.
// You can also pass {angular: AngularInstance} to the Integrations.Angular() constructor.
Sentry.init({
  dsn: "your DSN here",
  integrations: [new Integrations.Angular()],
});

// Finally require ngSentry as a dependency in your application module.
angular.module("yourApplicationModule", ["ngSentry"]);
```

In case you are using the CDN version or the Loader, we provide a standalone file for every integration, you can use it
like this:

```html
<!-- Note that we now also provide a es6 build only -->
<!-- <script src="https://browser.sentry-cdn.com/5.27.6/bundle.es6.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.es6.min.js %}" crossorigin="anonymous"></script> -->
<script src="https://browser.sentry-cdn.com/5.27.6/bundle.min.js"></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Angular -->
<script
  src="https://browser.sentry-cdn.com/5.27.6/angular.min.js"
  crossorigin="anonymous"
></script>

<script>
  Sentry.init({
    dsn: "___PUBLIC_DSN___",
    integrations: [new Sentry.Integrations.Angular()],
  });
</script>
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

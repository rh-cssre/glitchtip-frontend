The Sanic integration adds support for the [Sanic Web Framework](https://github.com/huge-success/sanic). We support all LTS versions of Sanic starting from `0.8`. Additionally, a Python version of 3.6 or greater is required.

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. If you're on Python 3.6, you also need the `aiocontextvars` package:

   ```bash
   $ pip install --upgrade aiocontextvars
   ```

3. To configure the SDK, initialize it with the integration before or after your app has been initialized:

   ```python
   import sentry_sdk
   from sentry_sdk.integrations.sanic import SanicIntegration
   from sanic import Sanic

   sentry_sdk.init(
       dsn="YOUR-GLITCHTIP-DSN-HERE",
       integrations=[SanicIntegration()]
   )

   app = Sanic(__name__)
   ```

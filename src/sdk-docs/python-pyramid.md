The Pyramid integration adds support for the [Pyramid Web Framework](https://trypyramid.com/).

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. To configure the SDK, initialize it with the integration before or after your app has been created:

   ```python
   import sentry_sdk

   from sentry_sdk.integrations.pyramid import PyramidIntegration

   sentry_sdk.init(
       dsn="YOUR-GLITCHTIP-DSN-HERE",
       integrations=[PyramidIntegration()]
   )

   from pyramid.config import Configurator

   with Configurator() as config:
       ...
   ```

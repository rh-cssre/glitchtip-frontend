The AIOHTTP integration adds support for the [AIOHTTP-Server Web
Framework](https://docs.aiohttp.org/en/stable/web.html). A Python version of
3.6 or greater is required.

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. If you're on Python 3.6, you also need the `aiocontextvars` package:

   ```bash
   $ pip install --upgrade aiocontextvars
   ```

3. Initialize the SDK before starting the server:

   ```python
   import sentry_sdk
   from sentry_sdk.integrations.aiohttp import AioHttpIntegration

   sentry_sdk.init(
       dsn="your DSN here",
       integrations=[AioHttpIntegration()]
   )

   from aiohttp import web

   async def hello(request):
       return web.Response(text="Hello, world")

   app = web.Application()
   app.add_routes([web.get('/', hello)])

   web.run_app(app)
   ```

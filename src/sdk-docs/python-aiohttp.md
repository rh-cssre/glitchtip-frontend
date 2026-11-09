Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your aiohttp app:

```python
import sentry_sdk
from aiohttp import web

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

async def hello(request):
    return web.Response(text="Hello, world")

app = web.Application()
app.add_routes([web.get("/", hello)])
web.run_app(app)
```

The SDK auto-detects aiohttp and captures unhandled exceptions and request data.

Verify your setup:

```python
async def trigger_error(request):
    division_by_zero = 1 / 0
```

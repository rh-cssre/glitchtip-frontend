Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK and wrap your ASGI app with `SentryAsgiMiddleware`:

```python
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

async def app(scope, receive, send):
    # Your ASGI application
    pass

app = SentryAsgiMiddleware(app)
```

The ASGI middleware captures unhandled exceptions and request data from any ASGI-compatible framework.

## Tips

- If you're using FastAPI, Django, or Starlette, prefer their dedicated integrations — they provide richer context automatically.
- This integration is useful for custom ASGI applications or less common frameworks.

If you use a WSGI framework with a dedicated integration (Django, Flask, etc.), prefer that instead — it provides richer context automatically.

For raw WSGI apps or unsupported frameworks, use the generic WSGI middleware:

```bash
pip install sentry-sdk
```

```python
import sentry_sdk
from sentry_sdk.integrations.wsgi import SentryWsgiMiddleware

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

def app(environ, start_response):
    start_response("200 OK", [("Content-Type", "text/plain")])
    return [b"Hello, world"]

app = SentryWsgiMiddleware(app)
```

The middleware captures unhandled exceptions and attaches request information to events.

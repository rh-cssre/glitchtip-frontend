Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your Sanic app:

```python
import sentry_sdk
from sanic import Sanic

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

app = Sanic("MyApp")
```

The SDK auto-detects Sanic and captures unhandled exceptions and request data.

Verify your setup:

```python
@app.route("/error")
async def trigger_error(request):
    division_by_zero = 1 / 0
```

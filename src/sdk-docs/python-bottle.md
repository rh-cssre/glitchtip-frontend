Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your Bottle app:

```python
import sentry_sdk
from bottle import Bottle

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

app = Bottle()
```

The SDK auto-detects Bottle and captures unhandled exceptions and request data.

Verify your setup:

```python
@app.route("/error")
def trigger_error():
    division_by_zero = 1 / 0
```

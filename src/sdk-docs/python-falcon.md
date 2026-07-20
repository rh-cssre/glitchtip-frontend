Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your Falcon app:

```python
import sentry_sdk
import falcon

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

app = falcon.App()
```

The SDK auto-detects Falcon and captures unhandled exceptions and request data.

Verify your setup:

```python
class ErrorResource:
    def on_get(self, req, resp):
        division_by_zero = 1 / 0

app.add_route("/error", ErrorResource())
```

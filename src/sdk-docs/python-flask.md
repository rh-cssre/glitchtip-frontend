Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your Flask app:

```python
import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,  # 1% of transactions — adjust to your needs
    auto_session_tracking=False,  # GlitchTip does not support sessions
    # enable_logs=True,  # Opt-in: send logs to GlitchTip (uses disk space)
)

app = Flask(__name__)
```

The SDK auto-detects Flask and captures unhandled exceptions, request data, and template rendering breadcrumbs.

Verify your setup:

```python
@app.route("/error")
def trigger_error():
    division_by_zero = 1 / 0
```

## Tips

- Set `traces_sample_rate` to a low value in production to save disk space.
- The SDK automatically adds breadcrumbs for template rendering and HTTP requests.

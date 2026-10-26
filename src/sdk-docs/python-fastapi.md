Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your FastAPI app:

```python
import sentry_sdk
from fastapi import FastAPI

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,  # 1% of transactions — adjust to your needs
    auto_session_tracking=False,  # GlitchTip does not support sessions
    # enable_logs=True,  # Opt-in: send logs to GlitchTip (uses disk space)
)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

The SDK auto-detects FastAPI and captures unhandled exceptions, request data, and async context automatically.

Verify your setup by adding a test endpoint:

```python
@app.get("/error")
async def trigger_error():
    division_by_zero = 1 / 0
```

## Tips

- FastAPI's async handlers are fully supported. The SDK tracks async context across `await` calls.
- Set `traces_sample_rate` to a low value in production. Each HTTP request is a transaction — even 1% gives useful [performance data](/documentation/performance).

Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK in your Celery worker configuration (e.g., `celery.py` or the module that creates the Celery app):

```python
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,  # 1% of transactions — adjust to your needs
    auto_session_tracking=False,  # GlitchTip does not support sessions
    # enable_logs=True,  # Opt-in: send logs to GlitchTip (uses disk space)
)
```

The SDK auto-detects Celery and captures task failures, retries, and soft time limit exceptions. Each task execution is captured as a transaction when tracing is enabled.

Verify your setup with a failing task:

```python
@app.task
def trigger_error():
    division_by_zero = 1 / 0
```

## Tips

- Initialize the SDK in both your web process and your worker process to capture errors from both.
- Celery tasks can generate high transaction volume. Keep `traces_sample_rate` low to save disk space.

Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK in your worker configuration:

```python
# mysettings.py
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)
```

Start your RQ worker:

```bash
rq worker -c mysettings
```

The SDK auto-detects RQ (Redis Queue) and captures failed job exceptions.

## Tips

- Initialize the SDK in both your web process (where jobs are enqueued) and your worker process to capture errors from both sides.

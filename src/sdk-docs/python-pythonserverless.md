For AWS Lambda specifically, prefer the dedicated AWS Lambda integration — it provides richer context.

For other serverless providers, use the generic `@serverless_function` decorator:

```bash
pip install sentry-sdk
```

```python
import sentry_sdk
from sentry_sdk.integrations.serverless import serverless_function

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

@serverless_function
def handler(event, context):
    # Your serverless function code
    pass
```

The decorator ensures events are flushed before the function returns or is frozen.

## Tips

- Keep `traces_sample_rate` low — serverless functions can generate high transaction volume.

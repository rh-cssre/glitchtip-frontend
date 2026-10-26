Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK with the AWS Lambda integration:

```python
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
    integrations=[AwsLambdaIntegration()],
)

def handler(event, context):
    # Your Lambda function code
    pass
```

The integration captures unhandled exceptions, adds Lambda context (function name, request ID), and ensures events are flushed before the function freezes.

## Tips

- Lambda functions can be frozen between invocations. The integration handles flushing events before the runtime freezes.
- If you're using a web framework (Flask, FastAPI) inside Lambda, enable that integration too — the framework may catch exceptions before the Lambda integration sees them.
- Keep `traces_sample_rate` low — Lambda functions can generate high transaction volume.

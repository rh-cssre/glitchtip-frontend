The celery integration adds support for the [Celery Task Queue System](http://www.celeryproject.org/).

Add `CeleryIntegration()` to your `integrations` list:

```python
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init("YOUR-GLITCHTIP-DSN-HERE", integrations=[CeleryIntegration()])
```

Additionally, the Python SDK will set the transaction on the event to the task name, and it will improve the grouping for global Celery errors such as timeouts.

The integration will automatically report errors from all celery jobs.

Install `sentry-sdk` into your Django project:

```bash
$ pip install --upgrade sentry-sdk
```

To configure the SDK, initialize it with the Django integration in your `settings.py` file:

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="your DSN here",
    integrations=[DjangoIntegration()]
)
```

You can verify your SDK installation by creating a route that triggers an error:

```py
from django.urls import path

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('glitchtip-debug/', trigger_error),
    # ...
]
```

Visiting this route will trigger an error that will be captured by GlitchTip.

The Django integration adds support for the [Django Web Framework](https://www.djangoproject.com/)
from Version 1.6 upwards.

Install `sentry-sdk`:

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

You can easily verify your SDK installation by creating a route that triggers an error:

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

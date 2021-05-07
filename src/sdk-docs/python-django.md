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
    integrations=[DjangoIntegration()],
    auto_session_tracking=False,
    traces_sample_rate=0
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

## Configuration

Here is a more robust configuration example:

```python
sentry_sdk.init(
    dsn="your DSN here",
    integrations=[DjangoIntegration()],
    auto_session_tracking=False,
    traces_sample_rate=0.01,
    release="1.0.0",
    environment="production",
)
```

- dsn - Where to send event data too, found in GlitchTip in project settings.
- integrations - Platform integrations such as DjangoIntegration and CeleryIntegration.
- auto_session_tracking - Not supported, set to False.
- traces_sample_rate - Percent of requests that are sent to GlitchTip as a performance monitoring transaction. 0.01 meaning 1%. We recommend setting to a low value to save costs/disk space.
- release - Set release name such as "1.0". Defaults to environment variable `SENTRY_RELEASE`.
- environment - Set the running environment name, such as "production". Defaults to environment variable `SENTRY_ENVIRONMENT`.
- send_default_pii - Set to True to send additional PII event data. Defaults to False.
- debug - Set to True to view more information about the SDK when something goes wrong. Defaults to False.

## Content Security Policy Reporting with Django-CSP

Using Content Security Policy (CSP)? Send reports to GlitchTip. Set your website's CSP `report-uri` directive to the GlitchTip Security Endpoint.

If using Django-CSP, in settings.py set:

```python
CSP_REPORT_URI = ["your Security Endpoint here"]
```

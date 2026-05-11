Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Add the following to your Django `settings.py`:

```python
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,  # 1% of transactions — adjust to your needs
    auto_session_tracking=False,  # GlitchTip does not support sessions
    # enable_logs=True,  # Opt-in: send logs to GlitchTip (uses disk space)
)
```

The SDK auto-detects Django and enables the integration automatically. This captures unhandled exceptions in views, middleware errors, and SQL query breadcrumbs.

Verify your setup by adding a test view:

```python
from django.urls import path

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path("glitchtip-debug/", trigger_error),
]
```

## Tips

- Set `traces_sample_rate` to a low value in production. Django transactions cover each HTTP request — even 1% gives you useful [performance data](/documentation/performance) without excessive storage.
- The SDK automatically adds breadcrumbs for database queries, template rendering, and middleware.
- Use `release` and `environment` options to track which deployments introduce errors.

## Content Security Policy Reporting

Using Content Security Policy (CSP)? Send reports to GlitchTip. Set your website's CSP `report-uri` directive to the GlitchTip Security Endpoint.

Django 6.0+ includes built-in CSP support. In `settings.py` set:

```python
SECURE_CSP = {
    # ...
    "report-uri": ["your Security Endpoint here"],
}
```

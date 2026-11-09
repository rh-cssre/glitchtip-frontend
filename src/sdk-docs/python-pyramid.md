Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before creating your Pyramid app:

```python
import sentry_sdk
from pyramid.config import Configurator

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

with Configurator() as config:
    config.add_route("home", "/")
    app = config.make_wsgi_app()
```

The SDK auto-detects Pyramid and captures unhandled exceptions and request data.

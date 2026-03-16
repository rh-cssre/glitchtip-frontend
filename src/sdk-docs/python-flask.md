The Flask integration adds support for the [Flask Web
Framework](http://flask.pocoo.org/).

Install `sentry-sdk` from PyPI with the `flask` extra:

```bash
$ pip install --upgrade sentry-sdk[flask]
```

To configure the SDK, initialize it with the integration before or after your app has been initialized:

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="YOUR-GLITCHTIP-DSN-HERE",
    integrations=[FlaskIntegration()]
)

app = Flask(__name__)
```

You can verify your SDK installation by creating a route that triggers an error:

```py
@app.route('/debug-glitchtip')
def trigger_error():
    division_by_zero = 1 / 0
```

Visiting this route will trigger an error that will be captured by GlitchTip.

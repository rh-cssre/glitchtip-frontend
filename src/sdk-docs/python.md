Install the Python SDK using [`pip`](https://pip.pypa.io/en/stable/):

```bash
$ pip install --upgrade sentry-sdk
```

Import and initialize the SDK early in your application's setup:

```python
import sentry_sdk
sentry_sdk.init("YOUR-GLITCHTIP-DSN-HERE")
```

You can cause a Python error by inserting a divide by zero expression
into your application:

```py
division_by_zero = 1 / 0
```

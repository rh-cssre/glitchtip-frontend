Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK before starting your Tornado application:

```python
import sentry_sdk
import tornado.web
import tornado.ioloop

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,
    auto_session_tracking=False,
)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

app = tornado.web.Application([(r"/", MainHandler)])
```

The SDK auto-detects Tornado and captures unhandled exceptions in request handlers.

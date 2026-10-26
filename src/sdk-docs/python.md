Install the sentry Python SDK:

```bash
pip install sentry-sdk
```

Initialize the SDK as early as possible in your application:

```python
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.01,  # 1% of transactions — adjust to your needs
    auto_session_tracking=False,  # GlitchTip does not support sessions
    # enable_logs=True,  # Opt-in: send logs to GlitchTip (uses disk space)
)
```

Verify your setup by triggering a test error:

```python
division_by_zero = 1 / 0
```

## Tips

- Set `traces_sample_rate` to a low value in production to save disk space. Most teams find 1–10% sufficient.
- Use the `release` and `environment` options to track which deployments introduce errors.
- Upload source maps or debug symbols with the [GlitchTip CLI](/documentation/cli) for readable stack traces.

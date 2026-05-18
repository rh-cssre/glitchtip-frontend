# Logs

GlitchTip can ingest, store, and query application logs. Logs are sent through the same SDK and endpoint you already use for errors, and can be correlated with traces and issues for full observability.

## Enabling Logs

Log ingestion is enabled by default on the server. To disable it, set:

```
GLITCHTIP_ENABLE_LOGS=False
```

When disabled, log events are silently dropped at ingest.

## Sending Logs

The easiest way to send logs to GlitchTip is with an MIT sentry SDK. GlitchTip accepts logs through the standard envelope endpoint, so no extra configuration is needed beyond enabling the feature in the SDK.

### Python

```python
import sentry_sdk

sentry_sdk.init(
    dsn="https://your-dsn@your-glitchtip.example.com/1",
    traces_sample_rate=0.01,  # 1% of transactions — adjust to your needs
    auto_session_tracking=False,  # GlitchTip does not support sessions
    enable_logs=True,
)
```

Logs emitted through the standard `logging` module are forwarded automatically. You can also call `sentry_sdk.logger.info(...)` directly.

### JavaScript

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://your-dsn@your-glitchtip.example.com/1",
  tracesSampleRate: 0.01,
  autoSessionTracking: false,
  enableLogs: true,
});
```

See the [SDK setup pages](/) for other languages — any SDK that supports the structured logs feature will work.

### OpenTelemetry

If your application already emits logs through OpenTelemetry, use the sentry-sdk's OTel logs integration rather than pointing an `OTLPLogExporter` at GlitchTip directly. GlitchTip does not expose a raw OTLP HTTP receiver — it accepts OTel-format log records only when they are wrapped in a sentry envelope by the SDK.

## Querying Logs

In the GlitchTip UI, navigate to your project's **Logs** page to browse and search logs.

### Filtering

- **Level** — Filter by severity: trace, debug, info, warn, error, fatal
- **Service** — Filter by the service name that emitted the log
- **Environment** — Filter by deployment environment
- **Full-text search** — Search log message bodies

### Trace Correlation

Logs that include a `trace_id` are linked to their corresponding transaction. Click a log entry's trace ID to navigate to the associated transaction and spans.

## Retention and Storage

Log retention is controlled by these environment variables:

| Variable | Default | Description |
|---|---|---|
| `GLITCHTIP_LOG_RETENTION_DAYS` | `GLITCHTIP_RETENTION_DAYS` (90) | Total days to keep logs (hot + cold) |
| `GLITCHTIP_LOG_HOT_DAYS` | 7 | Days to keep logs in PostgreSQL before archival |

### Cold Storage

When [DuckDB cold storage](/documentation/install#cold-storage) is enabled, logs older than `GLITCHTIP_LOG_HOT_DAYS` are archived to Parquet files on S3 or the local filesystem. Archived logs remain queryable through the UI and API — GlitchTip queries hot storage (PostgreSQL) first and falls back to cold storage (DuckDB + Parquet) for older data.

## CLI Access

You can query logs from the command line using the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli logs list --org your-org
```

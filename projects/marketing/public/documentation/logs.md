# Logs

GlitchTip can ingest, store, and query application logs sent via the OpenTelemetry Protocol (OTLP). Logs can be correlated with traces and errors for full observability.

## Enabling Logs

Set the following environment variable on your GlitchTip server:

```
GLITCHTIP_ENABLE_LOGS=True
```

When disabled (the default), log events are rejected at ingest.

## Sending Logs

GlitchTip accepts logs via the OpenTelemetry OTLP endpoint. Configure your application's OpenTelemetry SDK to export logs to your GlitchTip instance.

### Python Example

```bash
pip install opentelemetry-sdk opentelemetry-exporter-otlp
```

```python
from opentelemetry.sdk._logs import LoggerProvider
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter

logger_provider = LoggerProvider()
logger_provider.add_log_record_processor(
    BatchLogRecordProcessor(
        OTLPLogExporter(endpoint="https://your-glitchtip.example.com/api/0/envelope/")
    )
)
```

Consult the [OpenTelemetry documentation](https://opentelemetry.io/docs/) for SDK setup in other languages.

## Querying Logs

In the GlitchTip UI, navigate to your project's **Logs** page to browse and search logs.

### Filtering

- **Level** — Filter by severity: trace, debug, info, warn, error, fatal
- **Service** — Filter by the service name that emitted the log
- **Environment** — Filter by deployment environment
- **Full-text search** — Search log message bodies

### Trace Correlation

Logs that include a `trace_id` are automatically linked to their corresponding trace. Click a log entry's trace ID to navigate to the associated transaction and spans.

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

# Performance Monitoring

GlitchTip captures transaction and span data from your applications, helping you identify slow endpoints and performance regressions.

## How It Works

When tracing is enabled in your Sentry SDK, GlitchTip receives **transactions** (representing top-level operations like HTTP requests) and **spans** (representing child operations like database queries or API calls within a transaction). These are grouped by endpoint or operation for aggregate analysis.

## Configuring Tracing

Enable tracing in your Sentry SDK by setting `tracesSampleRate`:

```python
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_DSN",
    traces_sample_rate=0.1,  # capture 10% of transactions
)
```

```javascript
Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.1,
});
```

Set `tracesSampleRate` to a value between `0.0` and `1.0`. Use a lower rate in production to reduce overhead and data volume.

See your platform's [SDK documentation](/sdkdocs) for framework-specific tracing setup.

## Viewing Performance Data

Navigate to the **Performance** page in GlitchTip to see transaction groups with aggregate stats including average duration, p50, p95, request count, and error count.

Click a transaction group to see its span breakdown — which child operations (database queries, HTTP calls, template rendering) are consuming the most time.

## Cold Storage

When [DuckDB cold storage](/documentation/install#cold-storage) is enabled, transaction and span data is archived to Parquet files. This enables advanced queries like span grouping across transactions and N+1 query detection.

## AI-Assisted Analysis

With the [MCP server](/documentation/mcp) enabled, AI assistants can query your performance data to:

- Find slow endpoints and database queries
- Detect N+1 query patterns
- Analyze performance trends over time
- Identify regressions between releases

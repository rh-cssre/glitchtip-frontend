To start using GlitchTip, you will need to:

1. Install the sentry SDK for your platform into your project.
2. Configure it with your **DSN** (Data Source Name) so it knows where to send events. Your DSN can be found in your project's settings.
3. Initialize the SDK early in your application's startup.

## General Configuration

Most SDKs support these options:

- **dsn** — Where to send event data. Found in GlitchTip under project settings.
- **release** — Your application version (e.g., `"1.0.0"`). Helps track which releases introduce errors.
- **environment** — The running environment name (e.g., `"production"`, `"staging"`).
- **traces_sample_rate** — Sample rate for performance transactions (`0.0` to `1.0`). Use a low value like `0.01` (1%) in production to save disk space.
- **auto_session_tracking** — Set to `false`. GlitchTip does not support session tracking.

## Performance Monitoring

Enable [performance monitoring](/documentation/performance) by setting `traces_sample_rate`. Sample your transactions to keep data volume manageable — most teams find 1–10% sufficient.

## Logs

GlitchTip can ingest [application logs](/documentation/logs) via OpenTelemetry. See the logs documentation for setup.

## Source Maps & Debug Symbols

Use the [GlitchTip CLI](/documentation/cli) to upload source maps and debug symbols for readable stack traces in production.

## AI-Assisted Debugging

GlitchTip includes an [MCP server](/documentation/mcp) that lets AI assistants investigate errors, analyze performance, and query logs.

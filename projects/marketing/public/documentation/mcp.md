# MCP (Model Context Protocol)

GlitchTip includes a built-in MCP server that allows AI assistants to interact with your error tracking, performance, and log data.

## Enabling MCP

Set the following environment variable on your GlitchTip server:

```
GLITCHTIP_ENABLE_MCP=True
```

The MCP endpoint is available at:

```
https://your-glitchtip.example.com/mcp
```

## Authentication

The MCP server supports two ways to authenticate:

- **OAuth 2.0** — Compatible clients connect with no manual setup. The server supports dynamic client registration, so the client registers itself and handles the OAuth flow for you.
- **API token** — Alternatively, authenticate with a GlitchTip API token, for clients that don't support OAuth or when you'd rather use a static credential.

## Connecting an AI Client

### Claude Desktop

Add GlitchTip as an MCP server in your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "glitchtip": {
      "url": "https://your-glitchtip.example.com/mcp"
    }
  }
}
```

Claude Desktop will handle the OAuth flow automatically when you first connect.

### Claude Code

Add GlitchTip from the command line with `claude mcp add`:

```
claude mcp add --transport http glitchtip https://your-glitchtip.example.com/mcp
```

On first connect, Claude Code walks you through authentication.

### Other MCP Clients

Any MCP-compatible client can connect to the endpoint. The server uses the Streamable HTTP transport and advertises its OAuth configuration for automatic discovery.

## Available Tools

The MCP server exposes 17 tools across several categories:

### Organizations & Projects

- **list_organizations** — List all organizations the authenticated user can access
- **list_projects** — List all projects in an organization

### Issue Management

- **list_issues** — List issues, optionally filtered by project. Use `query='is:unresolved'` for active issues
- **get_issue** — Get details for a single issue by ID
- **get_latest_event** — Get the latest event for an issue
- **get_event** — Look up a specific event by ID, returned with its parent issue
- **update_issue** — Resolve, unresolve, or ignore an issue

### Performance Monitoring

- **list_transaction_groups** — List endpoints/operations with performance stats (avg duration, p50, p95)
- **get_transaction_group** — Get details for a single transaction group
- **list_transaction_spans** — Get span breakdown for a transaction group (requires DuckDB)
- **list_span_groups** — Query span groups across the organization (e.g., slow DB queries). Use `op='db'` to find slow database queries (requires DuckDB)
- **detect_n_plus_one** — Detect N+1 query patterns across transactions (requires DuckDB)
- **get_transaction_trend** — Get daily performance trend for a transaction group (requires DuckDB)

### Alerting & Monitoring

- **list_alerts** — List alert rules for an organization, optionally filtered by project
- **list_monitors** — List uptime monitors for an organization

### Logs

- **list_logs** — Search log events by level, service, environment, trace ID, or text query
- **get_log** — Get a single log event by ID

## Use Cases

With the MCP server, AI assistants can:

- **Investigate errors** — Browse issues, inspect stack traces and event data, and resolve issues
- **Analyze performance** — Find slow endpoints, detect N+1 query patterns, and identify performance regressions
- **Query logs** — Search application logs and correlate them with traces
- **Monitor status** — Check alert configurations and uptime monitor status

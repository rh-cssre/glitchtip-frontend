# GlitchTip CLI (Beta)

> **Beta**: The GlitchTip CLI is pre-1.0 software. Commands and options may change between releases.

The GlitchTip CLI is a command-line tool for interacting with GlitchTip. It can upload source maps and debug symbols, manage releases, send test events, and more.

## Installation

### Pre-built Binaries

Download a pre-built binary from the [releases page](https://gitlab.com/glitchtip/glitchtip-cli/-/releases).

### From Source

If you have Rust installed:

```bash
cargo install --git https://gitlab.com/glitchtip/glitchtip-cli.git
```

## Authentication

Log in to your GlitchTip instance:

```bash
glitchtip-cli --url https://your-glitchtip.example.com login
```

By default this prompts you to paste an API token. Use `--method oauth` for browser-based OAuth authentication:

```bash
glitchtip-cli --url https://your-glitchtip.example.com login --method oauth
```

Credentials are saved to a local `.sentryclirc` file (or globally with `--global` to `~/.config/glitchtip-cli/config`).

## Configuration

The CLI uses a four-tier configuration system (highest priority first):

1. **CLI flags** — `--url`, `--auth-token`, `--org`, `--project`
2. **Environment variables** — `SENTRY_URL`, `SENTRY_AUTH_TOKEN`, `SENTRY_DSN`, etc.
3. **Local config file** — `.glitchtip-cli.rc` or `.sentryclirc` (searched upward from current directory, INI format)
4. **Global config file** — `~/.config/glitchtip-cli/config` (INI format)

Key environment variables:

| Variable | Description |
|---|---|
| `SENTRY_URL` | Your GlitchTip instance URL |
| `SENTRY_AUTH_TOKEN` | API authentication token |
| `SENTRY_DSN` | Project DSN (for `send-event` and `monitors`) |
| `SENTRY_ORG` | Default organization slug |
| `SENTRY_PROJECT` | Default project slug |

Example config file (INI format):

```ini
[auth]
token=your-api-token

[defaults]
url=https://your-glitchtip.example.com
org=my-org
project=my-project
```

## Commands

### Test Events

Send a test event to verify your setup:

```bash
glitchtip-cli send-event -m "Test event from CLI"
```

### Releases

Create and manage releases:

```bash
# Create a new release
glitchtip-cli releases new 1.0.0 --org my-org --project my-project

# Finalize a release
glitchtip-cli releases finalize 1.0.0 --org my-org --project my-project

# Associate commits with a release (auto-discovers from git)
glitchtip-cli releases set-commits 1.0.0 --auto --org my-org --project my-project

# List releases
glitchtip-cli releases list --org my-org --project my-project

# Delete a release
glitchtip-cli releases delete 1.0.0 --org my-org --project my-project
```

### Deploys

Record deployments for a release:

```bash
glitchtip-cli deploys new 1.0.0 --env production --org my-org --project my-project
glitchtip-cli deploys list 1.0.0 --org my-org --project my-project
```

### Source Maps

Upload source maps for readable JavaScript stack traces:

```bash
# Inject debug IDs into source files
glitchtip-cli sourcemaps inject ./dist

# Upload source maps with debug IDs
glitchtip-cli sourcemaps upload ./dist --release 1.0.0 --org my-org --project my-project
```

### Debug Files

Upload debug symbols for native applications (dSYM, PDB, ELF):

```bash
glitchtip-cli debug-files upload ./build --org my-org --project my-project
```

### Uptime Monitors

Manage uptime monitors and send heartbeats:

```bash
# List monitors
glitchtip-cli monitors list --org my-org

# Run a command and send a heartbeat on success
glitchtip-cli monitors run <ENDPOINT_UUID> -- python manage.py scheduled_task

# Create a monitor
glitchtip-cli monitors create "My Monitor" --url https://example.com --org my-org --project my-project

# Delete a monitor
glitchtip-cli monitors delete <MONITOR_ID> --org my-org
```

### Issues

Manage issues from the command line:

```bash
# List issues
glitchtip-cli issues list --org my-org --project my-project

# Resolve issues
glitchtip-cli issues resolve --id 123

# Mute issues
glitchtip-cli issues mute --id 456

# Unresolve issues
glitchtip-cli issues unresolve --id 789
```

### Logs

Query logs from the command line:

```bash
glitchtip-cli logs list --org my-org
```

### Info

Check your current configuration and authentication status:

```bash
glitchtip-cli info
```

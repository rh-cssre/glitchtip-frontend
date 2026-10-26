Install the sentry Symfony SDK:

```bash
composer require sentry/sentry-symfony
```

Configure in `config/packages/sentry.yaml`:

```yaml
sentry:
    dsn: "%env(SENTRY_DSN)%"
    options:
        traces_sample_rate: 0.01
```

Set the `SENTRY_DSN` environment variable to your GlitchTip DSN.

## Monolog Integration

If using Monolog, set `register_error_listener: false` and add the Monolog handler:

```yaml
sentry:
    dsn: "%env(SENTRY_DSN)%"
    register_error_listener: false
    options:
        traces_sample_rate: 0.01

monolog:
    handlers:
        sentry:
            type: sentry
            hub_id: Sentry\State\HubInterface
```

## Tips

- Keep `traces_sample_rate` low in production to save disk space.
- The SDK captures both logged errors (via Monolog) and unhandled exceptions automatically.

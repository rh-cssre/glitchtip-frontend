Install the [Raven module](https://www.drupal.org/project/raven) for Drupal:

```bash
composer require drupal/raven sentry/sdk:^4.0
```

Enable the module:

```bash
drush en raven
```

## Configuration

Configure your GlitchTip DSN in the Drupal admin UI at `admin/config/development/logging` under the "Sentry" section.

You can also set environment variables:

- `SENTRY_DSN` — Your GlitchTip DSN
- `SENTRY_ENVIRONMENT` — Environment name (e.g., `production`)
- `SENTRY_RELEASE` — Your application version

## Testing

Verify the integration:

```bash
drush raven:captureMessage "Test GlitchTip error"
```

## Tips

- See the Raven module README for advanced configuration options including breadcrumbs and JavaScript error tracking.

[Raven module](https://www.drupal.org/project/raven) provides integration with
GlitchTip for Drupal projects.

## Installation

Add the `drupal/raven` module to your project:

```bash
composer require drupal/raven
```

## Configuration

Configure your GlitchTip DSN and which events you want to send to GlitchTip in
the "Sentry" section of the logging and errors configuration page at
`admin/config/development/logging`.

You also have the option of setting environment variables for SENTRY_DSN,
SENTRY_ENVIRONMENT and SENTRY_RELEASE, which override their corresponding
configs if set.

You can use the commandline to verify that GlitchTip is capturing errors for
your project:

```bash
drush raven:captureMessage 'Mic check'
```

## Support

Please read the README included with Raven module, and file bug reports,
feature requests or support requests at the
[Raven project page](https://www.drupal.org/project/raven).

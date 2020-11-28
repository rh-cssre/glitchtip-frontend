Install the `sentry/sentry-symfony` package:

```bash
$ composer require sentry/sentry-symfony:^2
```

### Note

This documentation refers to the v2.x of the bundle.

## Installation

Enable the bundle in `app/AppKernel.php`:

```php
public function registerBundles()
{
    $bundles = [
        // ...
        new Sentry\SentryBundle\SentryBundle(),
    );

    // ...
}
```

Add your DSN to `app/config/config.yml`:

```yaml
sentry:
  dsn: "your DSN here"
```

You can verify that GlitchTip is capturing errors in your Symfony application by creating a debug route that will throw an exception:

```php
/**
 * @Route("/debug-sentry")
 */
public function debug_sentry()
{
    throw new Exception('My first GlitchTip error!');
}
```

Visiting this route will trigger an exception that will be captured by GlitchTip.

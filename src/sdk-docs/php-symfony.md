### Note

This documentation refers to the v3.0 of the bundle. You can continue to use if you're still using Symfony 2.

## Installation

Install the `sentry/sentry-symfony` package:

```bash
$ composer require sentry/sentry-symfony
```

### Enabling the bundle

If you're using the Symfony Flex plugin, you can skip this step; the Flex recipe will automatically enable the bundle.

Enable the bundle in `app/AppKernel.php`:

```php
<?php
class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            // ...

            new Sentry\SentryBundle\SentryBundle(),
        );

        // ...
    }

    // ...
}
```

### Setting up the DSN

Add your DSN to `app/config/config.yml`:

```yaml
sentry:
  dsn: "your DSN here"
```

If you're using the Symfony Flex plugin, you'll find this file already created for you; it will suggest using an environment variable to inject the DSN value securely.

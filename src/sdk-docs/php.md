Install the sentry PHP SDK using Composer:

```bash
composer require sentry/sdk
```

Initialize the SDK as early as possible in your application:

```php
\Sentry\init([
    'dsn' => 'YOUR_DSN',
    'traces_sample_rate' => 0.01, // 1% of transactions
]);
```

Verify your setup:

```php
throw new Exception("Test GlitchTip error!");
```

## Tips

- Set `traces_sample_rate` to a low value in production to save disk space.
- Use the `release` and `environment` options to track deployments.

Install the sentry Laravel SDK:

```bash
composer require sentry/sentry-laravel
```

Publish the config file:

```bash
php artisan sentry:publish --dsn=YOUR_DSN
```

This adds to your `.env` file:

- `SENTRY_LARAVEL_DSN` — Your GlitchTip DSN
- `SENTRY_TRACES_SAMPLE_RATE` — Transaction sampling rate (use `0.01` for 1%)

Verify your setup with a test route:

```php
Route::get('/debug-glitchtip', function () {
    throw new Exception('Test GlitchTip error!');
});
```

## Tips

- Keep `SENTRY_TRACES_SAMPLE_RATE` low in production. Each HTTP request is a transaction — even 1% gives useful [performance data](/documentation/performance) without excessive storage.
- Additional configuration is in `config/sentry.php`.

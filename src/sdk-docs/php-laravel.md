Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel
```

Create the SDK configuration file (`config/sentry.php`) with this command:

```sh
$ php artisan sentry:publish --dsn=YOUR-GLITCHTIP-DSN-HERE
```

This command adds to your .env file:

- `SENTRY_LARAVEL_DSN` - The DSN from your GlitchTip project.
- `SENTRY_TRACES_SAMPLE_RATE` - Between 0.0 and 1.0. 1.0 will send 100% of transactions to GlitchTip. You may wish to set it to a lower number to keep event count and disk space usage lower. Such as 0.2 for a 20% sampling rate.

Additional configuration settings are found in `config/sentry.php`.

Finally modify the register method of Handler in `app/Exceptions/Handler.php` to:

```php
use Sentry\Laravel\Integration;

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            Integration::captureUnhandledException($e);
        });
    }
```

## Testing

You can verify that GlitchTip is capturing errors in your Laravel application by creating a debug route that will throw an exception:

```php
Route::get('/', function () {
    throw new Exception('My first GlitchTip error!');
});
```

Visiting this route will trigger an exception that will be captured by GlitchTip.

Install the `sentry/sentry-laravel` package:

```bash
$ composer require sentry/sentry-laravel
```

If you're on Laravel 5.5 or later the package will be auto-discovered. Otherwise you will need to manually configure it in your `config/app.php`.

Add GlitchTip reporting to `App/Exceptions/Handler.php`:

```php
public function report(Exception $exception)
{
    if (app()->bound('sentry') && $this->shouldReport($exception)){
        app('sentry')->captureException($exception);
    }

    parent::report($exception);
}
```

Create the SDK configuration file (`config/sentry.php`) with this command:

```sh
$ php artisan vendor:publish --provider="Sentry\Laravel\ServiceProvider"
```

Add your DSN to `.env`:

```sh
SENTRY_LARAVEL_DSN=___PUBLIC_DSN___
```

You can verify that GlitchTip is capturing errors in your Laravel application by creating a debug route that will throw an exception:

```php
Route::get('/debug-sentry', function () {
    throw new Exception('My first GlitchTip error!');
});
```

Visiting this route will trigger an exception that will be captured by GlitchTip.

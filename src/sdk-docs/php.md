To install the SDK you will need to be using `composer` in your project. If you
are not already using Composer please see the [Composer documentation](https://getcomposer.org/download/).

```bash
composer require sentry/sdk
```

To capture all errors, even the one during the startup of your application, you should initialize the PHP SDK as soon as possible.

```php
Sentry\init(['dsn' => 'your DSN here' ]);
```

You can trigger a PHP exception by throwing one in your application:

```php
throw new Exception("My first GlitchTip error!");
```

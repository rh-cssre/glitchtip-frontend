## Installation

There are various ways to install the PHP integration for GlitchTip. The recommended way is to use [Composer](http://getcomposer.org/):

```bash
$ composer require sentry/sentry "^1.0"
```

Alternatively you can manually install it:

1.  Download and extract the latest [sentry-php](https://github.com/getsentry/sentry-php/archive/master.zip) archive to your PHP project.
2.  Require the autoloader in your application:

    ```php
    require_once '/path/to/Raven/library/Raven/Autoloader.php';
    Raven_Autoloader::register();
    ```

### Capturing Errors

Monolog supports GlitchTip out of the box. The only thing you’ll need to do is configure a handler:

```php
$client = new Raven_Client('YOUR-GLITCHTIP-DSN-HERE');

$handler = new Monolog\Handler\RavenHandler($client);
$handler->setFormatter(new Monolog\Formatter\LineFormatter("%message% %context% %extra%\n"));

$monolog->pushHandler($handler);
```

### Adding Context

Capturing context can be done via a monolog processor:

```php
$monolog->pushProcessor(function ($record) {
    // record the current user
    $user = Acme::getCurrentUser();
    $record['context']['user'] = array(
        'name' => $user->getName(),
        'username' => $user->getUsername(),
        'email' => $user->getEmail(),
    );

    // Add various tags
    $record['context']['tags'] = array('key' => 'value');

    // Add various generic context
    $record['extra']['key'] = 'value';

    return $record;
});
```

### Breadcrumbs

GlitchTip provides a breadcrumb handler to automatically send logs along as crumbs:

```php
$client = new Raven_Client('YOUR-GLITCHTIP-DSN-HERE');

$handler = new \Raven_Breadcrumbs_MonologHandler($client);
$monolog->pushHandler($handler);
```

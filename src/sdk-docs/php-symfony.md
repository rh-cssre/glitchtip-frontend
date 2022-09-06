## Installation

Install the `sentry/sentry-symfony` package:

```bash
composer require sentry/sentry-symfony
```

Set the environment variable "SENTRY_DSN" to your GlitchTip DSN. Alternatively you may set it directly in `config/packages/sentry.yaml`.

We recommend setting performance tracing to a lower rate, 0.1 would make 10% of requests will be traced.

```yaml
sentry:
  dsn: "%env(SENTRY_DSN)%"
  options:
    traces_sample_rate: 0.1
```

## Monolog Integration

If using Monolog, adjust the `config/packages/sentry.yaml` file as shown, setting sentry.register_error_listener to false and include the monolog section.

```yaml
sentry:
  dsn: "%env(SENTRY_DSN)%"
  register_error_listener: false
  options:
    traces_sample_rate: 0.1

monolog:
  handlers:
    sentry:
      type: sentry
      hub_id: Sentry\State\HubInterface
```

## Example error

This partial snippet shows logging an error and an unhandled exception. Both will contain some extra context.

```php
class HomeController extends AbstractController
{
    public $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @Route(name="home", path="/")
     */
    public function home(): Response
    {
        \Sentry\configureScope(function (\Sentry\State\Scope $scope): void {
            $scope->setContext('fun', [
                'some context' => 'yes'
            ]);
        });
        $this->logger->error('My custom logged error.');
        throw new \RuntimeException('Example exception.');

        return new Response(
            '<html><body>Hello World</body></html>'
        );
    }
}
```

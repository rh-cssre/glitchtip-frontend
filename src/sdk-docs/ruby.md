## Installation

Install the SDK via Rubygems by adding it to your Gemfile:

```ruby
gem "sentry-ruby"
```

## Configuration

To use Raven Ruby all you need is your DSN. Like most Sentry-compatible libraries, it will honor the `SENTRY_DSN` environment variable. You can find it on the project settings page under API Keys. You can either export it as environment variable or manually configure it with `Raven.configure`:

```ruby
Sentry.init do |config|
  config.dsn = 'YOUR_DSN_HERE'
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
end

```
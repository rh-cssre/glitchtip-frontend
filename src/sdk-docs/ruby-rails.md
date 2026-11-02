Add the sentry Rails SDK to your `Gemfile`:

```ruby
gem "sentry-ruby"
gem "sentry-rails"
```

Then run `bundle install`.

Create `config/initializers/sentry.rb`:

```ruby
Sentry.init do |config|
  config.dsn = "YOUR_DSN"
  config.traces_sample_rate = 0.01 # 1% of transactions
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
end
```

All uncaught exceptions in controllers are automatically reported.

Verify your setup with a test route:

```ruby
get "/debug-glitchtip" => proc { raise "Test GlitchTip error!" }
```

## Tips

- Set `traces_sample_rate` to a low value in production. Each HTTP request is a transaction — even 1% gives useful [performance data](/documentation/performance) without excessive storage.
- The SDK automatically adds breadcrumbs for Active Support events and HTTP requests.

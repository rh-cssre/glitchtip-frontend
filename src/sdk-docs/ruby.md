Add the sentry Ruby SDK to your `Gemfile`:

```ruby
gem "sentry-ruby"
```

Then run `bundle install`.

Initialize the SDK:

```ruby
Sentry.init do |config|
  config.dsn = "YOUR_DSN"
  config.traces_sample_rate = 0.01 # 1% of transactions
  config.breadcrumbs_logger = [:http_logger]
end
```

Verify your setup:

```ruby
Sentry.capture_message("Test GlitchTip error")
```

## Tips

- If you're using Rails, use `sentry-rails` instead for richer context.
- Set `traces_sample_rate` to a low value in production to save disk space.

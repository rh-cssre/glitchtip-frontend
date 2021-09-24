In Rails, all uncaught exceptions will be automatically reported.

We support Rails 4 and newer.

### Installation

Install the SDK via Rubygems by adding it to your `Gemfile`:

```ruby
gem "sentry-ruby"
gem "sentry-rails"
```

### Configuration

Create the file `config/initializers/sentry.rb` and configure the DSN, and any other settings you need:

```ruby
Sentry.init do |config|
  config.dsn = 'YOUR_DSN_HERE'
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
end
```

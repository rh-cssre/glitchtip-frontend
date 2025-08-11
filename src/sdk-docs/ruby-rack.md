### Installation

Install the SDK via Rubygems by adding it to your `Gemfile`:

```ruby
gem "sentry-raven"
```

### Configuration

Add `use Raven::Rack` to your `config.ru` or other rackup file (this is automatically inserted in Rails):

```ruby
require 'raven'

Raven.configure do |config|
  config.dsn = 'YOUR-GLITCHTIP-DSN-HERE'
end

use Raven::Rack
```

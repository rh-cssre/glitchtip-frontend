Add the sentry Elixir SDK to your `mix.exs`:

```elixir
defp deps do
  [
    {:sentry, "~> 10.0"},
    {:jason, "~> 1.4"},
    {:hackney, "~> 1.19"}
  ]
end
```

Configure in `config/runtime.exs` (recommended for runtime DSN loading):

```elixir
config :sentry,
  dsn: System.get_env("SENTRY_DSN"),
  environment_name: config_env(),
  enable_source_code_context: true,
  root_source_code_paths: [File.cwd!()]
```

## Setup :logger Handler

Add the handler in your application start:

```elixir
def start(_type, _args) do
  :logger.add_handler(:sentry_handler, Sentry.LoggerHandler, %{})
  # ...
end
```

## Phoenix Setup

Add to your Endpoint module:

```elixir
defmodule MyAppWeb.Endpoint do
  use Sentry.PlugCapture
  use Phoenix.Endpoint, otp_app: :my_app

  # After Plug.Parsers:
  plug Sentry.PlugContext
end
```

## Testing

```bash
MIX_ENV=dev mix sentry.send_test_event
```

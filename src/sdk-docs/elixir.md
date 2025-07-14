## Installation sentry-elixir sdk 10+

```elixir
defp deps do
  [
    # ...
    {:sentry, "~> 10.0"},
    {:jason, "~> 1.4"},
    {:hackney, "~> 1.19"}
  ]
end
```

## Configuration

Setup the application production environment in your `config/config.exs`

```elixir
config :sentry,
  dsn: "YOUR-GLITCHTIP-DSN-HERE",
  environment_name: Mix.env(),
  enable_source_code_context: true,
  root_source_code_paths: [File.cwd!()]
```

The `environment_name` is the name of the current environment.
To control in which environment Sentry is active use the `dsn` option and set it only in config files where it's used(e.g. `config/prod.exs`).

Sentry won't send anything as long you don't set the `dsn`.

**REMEMBER** that setting this option in a static config file such as `config/config.exs` or `config/prod.exs` will require a recompile each time
if you're loading it from system's environment for example(`System.get_env("SENTRY_DSN")`).

To avoid that you can make use of `config/runtime.exs` which will set the config whenever you start the app.

## Setup :logger handler

This library comes with a :logger handler to capture error messages coming from process crashes. To enable this, add the handler when your application starts:

```diff
  def start(_type, _args) do
+   :logger.add_handler(:sentry_handler, Sentry.LoggerHandler, %{})

    # ...
  end
```

## Setup with Plug or Phoenix

If using an environment with Phoenix, add the following to MyAppWeb.Endpoint:

```diff
 defmodule MyAppWeb.Endpoint
   # lib/my_app_web/endpoint.ex
+  use Sentry.PlugCapture
   use Phoenix.Endpoint, otp_app: :my_app
   # ...
   plug Plug.Parsers,
     parsers: [:urlencoded, :multipart, :json],
     pass: ["*/*"],
     json_decoder: Phoenix.json_library()

+  plug Sentry.PlugContext
```

If you're also using Phoenix LiveView, consider also setting up your LiveViews to use the [Sentry.LiveViewHook](https://hexdocs.pm/sentry/Sentry.LiveViewHook.html) hook:

```elixir
defmodule MyAppWeb do
  def live_view do
    quote do
      use Phoenix.LiveView

      on_mount Sentry.LiveViewHook
    end
  end
end
```

If using an environment without Phoenix, add the following at the top of your Plug application, and add `Sentry.PlugContext` below `Plug.Parsers` (if it is in stack)

```elixir
 defmodule MyApp.Router do
   use Plug.Router
+  use Sentry.PlugCapture
   # ...
   plug Plug.Parsers,
     parsers: [:urlencoded, :multipart]

+  plug Sentry.PlugContext
```

## Capture Crashed Process Exceptions

Extension to capture all error messages that the Plug handler might skip:

```elixir
# config/config.exs
+  config :logger,
+    backends: [:console, Sentry.LoggerBackend]
```

## Testing Your Configuration

To ensure you've set up your configuration correctly we recommend running the included Mix task. It can be tested on different Mix environments and will tell you if it is not currently configured to send events in that environment:

```sh
MIX_ENV=dev mix sentry.send_test_event
```

## Installation 8.x (Elixir >= 1.10)

```elixir
defp deps do
  [
    # ...
    {:sentry, "~> 8.0"},
    {:jason, "~> 1.1"},
    {:hackney, "~> 1.8"},
    # if you are using plug_cowboy
    {:plug_cowboy, "~> 2.3"},
  ]
end
```

## Installation 7.x (Elixir < 1.10)

```elixir
defp deps do
  [
    # ...
    {:sentry, "~> 7.2"},
    {:jason, "~> 1.1"},
  ]
end
```

## Configuration

Setup the application production environment in your `config/config.exs`

```elixir
config :sentry,
  dsn: "your DSN here",
  environment_name: Mix.env(),
  included_environments: [:prod],
  enable_source_code_context: true,
  # 8.x
  root_source_code_paths: [File.cwd!()]
  # 7.x
  root_source_code_path: File.cwd!()
```

The `environment_name` and `included_environments` work together to determine if and when GlitchTip should record exceptions. The `environment_name` is the name of the current environment. 

This will set the environment name to whatever the current Mix environment atom is, but it will only send events if the current environment is `:prod`, since that is the only entry in the `included_environments` key.

You can even rely on more custom determinations of the environment name. It’s not uncommon for most applications to have a “staging” environment. In order to handle this without adding an additional Mix environment, you can set an environment variable that determines the release level.

```elixir
config :sentry, dsn: "your DSN here",
  included_environments: ~w(production staging),
  environment_name: System.get_env("RELEASE_LEVEL") || "development"
```

In this example, we are getting the environment name from the `RELEASE_LEVEL` environment variable. If that variable does not exist, it will default to `"development"`. Now, on your server, we can set the environment variable appropriately. On your local development machines, exceptions will never be sent, because the default value is not in the list of `included_environments`.

##  Setup with Plug or Phoenix (8.x)

If using an environment with Phoenix, add the following to MyAppWeb.Endpoint:

```elixir
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

##  Setup with Plug or Phoenix (7.x)

In your Plug.Router or Phoenix.Router, add the following lines:

```elixir
 # lib/my_app_web/router.ex
 defmodule MyAppWeb.Router do
   use MyAppWeb, :router
+  use Plug.ErrorHandler
+  use Sentry.Plug
```

If using Phoenix, you can include `Sentry.Phoenix.Endpoint`. This module captures errors in the Phoenix pipeline:

```elixir
 # lib/my_app_web/endpoint.ex
defmodule MyAppWeb.Endpoint
   use Phoenix.Endpoint, otp_app: :my_app
+  use Sentry.Phoenix.Endpoint
```

## Capture Crashed Process Exceptions 

Extension to capture all error messages that the Plug handler might skip:

```elixir
# config/config.exs
+  config :logger,
+    backends: [:console, Sentry.LoggerBackend]
```



## Installation

Edit your mix.exs file to add it as a dependency and add the `:sentry` package to your applications:

```elixir
defp deps do
  [
    # ...
    {:sentry, "~> 7.0"},
    {:jason, "~> 1.1"},
  ]
end
```

## Configuration

Setup the application production environment in your `config/prod.exs`

```elixir
config :sentry,
  dsn: "your DSN here",
  environment_name: :prod,
  enable_source_code_context: true,
  root_source_code_path: File.cwd!,
  tags: %{
    env: "production"
  },
  included_environments: [:prod]
```

The `environment_name` and `included_environments` work together to determine if and when GlitchTip should record exceptions. The `environment_name` is the name of the current environment. In the example above, we have explicitly set the environment to `:prod` which works well if you are inside an environment specific configuration like `config/prod.exs`.

An alternative is to use `Mix.env` in your general configuration file:

```elixir
config :sentry, dsn: "your DSN here",
   included_environments: [:prod],
   environment_name: Mix.env
```

This will set the environment name to whatever the current Mix environment atom is, but it will only send events if the current environment is `:prod`, since that is the only entry in the `included_environments` key.

You can even rely on more custom determinations of the environment name. It’s not uncommon for most applications to have a “staging” environment. In order to handle this without adding an additional Mix environment, you can set an environment variable that determines the release level.

```elixir
config :sentry, dsn: "your DSN here",
  included_environments: ~w(production staging),
  environment_name: System.get_env("RELEASE_LEVEL") || "development"
```

In this example, we are getting the environment name from the `RELEASE_LEVEL` environment variable. If that variable does not exist, it will default to `"development"`. Now, on our servers, we can set the environment variable appropriately. On our local development machines, exceptions will never be sent, because the default value is not in the list of `included_environments`.

If using an environment with Plug or Phoenix, add the following to your Plug.Router or Phoenix.Router:

```elixir
use Plug.ErrorHandler
use Sentry.Plug
```

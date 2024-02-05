### Installation

Install the **NuGet** package:

```shell
# Using Package Manager
Install-Package Sentry

# Or using .NET Core CLI
dotnet add package Sentry
```

<!--
### Using .NET Framework prior to 4.6.1?

[The legacy SDK](https://docs.sentry.io/clients/csharp/) supports .NET Framework as early as 3.5.
-->

### Configuration

You should initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

```csharp
SentrySdk.Init(options =>
{
    options.Dsn = "YOUR-GLITCHTIP-DSN-HERE";
});
```

You can verify GlitchTip is capturing unhandled exceptions by raising an exception:

```csharp
throw new Exception("Hello world!");
```

### Installation

Install the **NuGet** package:

```shell
# Using Package Manager
Install-Package Sentry -Version {% sdk_version sentry.dotnet %}

# Or using .NET Core CLI
dotnet add package Sentry -v {% sdk_version sentry.dotnet %}
```

<!--
### Using .NET Framework prior to 4.6.1?

[The legacy SDK](https://docs.sentry.io/clients/csharp/) supports .NET Framework as early as 3.5.
-->

### Configuration

You should initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

```csharp
using (SentrySdk.Init("your DSN here"))
{
    // App code
}
```

You can verify GlitchTip is capturing unhandled exceptions by raising an exception. For example, you can use the following snippet to raise a `DivideByZeroException`:

```csharp
using (SentrySdk.Init("your DSN here"))
{
    Console.WriteLine(1 / 0);
}
```

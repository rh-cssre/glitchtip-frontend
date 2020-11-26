Install the **NuGet** package:

Package Manager:

```shell
Install-Package Sentry.AspNetCore
```

.NET Core CLI:

```shell
dotnet add package Sentry.AspNetCore
```

Add the SDK to `Program.cs` through the `WebHostBuilder`:

ASP.NET Core 2.x:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry("your DSN here")
```

ASP.NET Core 3.0:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            // Add the following line:
            webBuilder.UseSentry("your DSN here")
        });
```

See the [provided examples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/master/samples) for examples to send your first event to GlitchTip.

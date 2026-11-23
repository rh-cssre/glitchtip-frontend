Install the sentry ASP.NET Core SDK:

```shell
dotnet add package Sentry.AspNetCore
```

Add the SDK to your `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseSentry(options =>
{
    options.Dsn = "YOUR_DSN";
    options.TracesSampleRate = 0.01; // 1% of transactions
});

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
```

The SDK automatically captures unhandled exceptions in controllers and middleware.

Verify your setup:

```csharp
app.MapGet("/debug-glitchtip", () =>
{
    throw new Exception("Test GlitchTip error!");
});
```

## Tips

- Set `TracesSampleRate` to a low value in production. Each HTTP request is a transaction — even 1% gives useful [performance data](/documentation/performance).

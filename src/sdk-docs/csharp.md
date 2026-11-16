Install the sentry .NET SDK:

```shell
dotnet add package Sentry
```

Initialize the SDK as early as possible (e.g., in `Program.cs`):

```csharp
using Sentry;

SentrySdk.Init(options =>
{
    options.Dsn = "YOUR_DSN";
    options.TracesSampleRate = 0.01; // 1% of transactions
});
```

Verify your setup:

```csharp
SentrySdk.CaptureMessage("Test GlitchTip error!");
```

## Tips

- Call `await SentrySdk.FlushAsync(TimeSpan.FromSeconds(2))` before your application exits.
- Set `TracesSampleRate` to a low value in production to save disk space.

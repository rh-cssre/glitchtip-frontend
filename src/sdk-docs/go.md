Install the sentry Go SDK:

```bash
go get github.com/getsentry/sentry-go
```

Initialize the SDK early in your application:

```go
package main

import (
    "log"
    "time"
    "github.com/getsentry/sentry-go"
)

func main() {
    err := sentry.Init(sentry.ClientOptions{
        Dsn: "YOUR_DSN",
        TracesSampleRate: 0.01, // 1% of transactions
    })
    if err != nil {
        log.Fatalf("sentry.Init: %s", err)
    }
    defer sentry.Flush(2 * time.Second)

    // Your application code here
}
```

Verify your setup:

```go
sentry.CaptureMessage("Test GlitchTip error")
```

## Tips

- Always call `sentry.Flush()` before your application exits to ensure events are sent.
- Set `TracesSampleRate` to a low value in production to save disk space.
- Use `sentry.CaptureException()` to manually report errors.

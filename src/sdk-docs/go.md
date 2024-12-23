Install the sentry-go SDK using [`go get`](https://golang.org/cmd/go/#hdr-Module_aware_go_get):

```bash
$ go get github.com/getsentry/sentry-go
```

Import and initialize the SDK early in your application's setup:

```go
import "github.com/getsentry/sentry-go"

func main() {
	sentry.Init(sentry.ClientOptions{
		Dsn: "YOUR-GLITCHTIP-DSN-HERE",
	})
}
```

Verify the SDK is sending errors to GlitchTip from your Go application by capturing an error:

```go
import (
	"errors"
	"time"
	"github.com/getsentry/sentry-go"
)

func main() {
	sentry.Init(sentry.ClientOptions{
		Dsn: "YOUR-GLITCHTIP-DSN-HERE",
	})

	sentry.CaptureException(errors.New("my error"))
	// Since sentry emits events in the background we need to make sure
	// they are sent before we shut down
	sentry.Flush(time.Second * 5)
}
```

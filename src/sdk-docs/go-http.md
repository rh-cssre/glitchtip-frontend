### Installation

```bash
$ go get github.com/getsentry/raven-go
```

### Setup

Make sure that you’ve set configured `raven` with your DSN, typically inside the `init()` in your `main` package is a good place.

```go
package main

import "github.com/getsentry/raven-go"

func init() {
	raven.SetDSN("your DSN here")
}
```

If you don’t call `SetDSN`, we will attempt to read it from your environment under the `SENTRY_DSN` environment variable. The release and environment will also be read from the environment variables `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` if set.

Next, wrap your `http.Handler` with `RecoveryHandler`:

```go
func raisesError(w http.ResponseWriter, r *http.Request) {
	panic("My first GlitchTip error!")
}

http.HandleFunc("/debug-glitchtip", raven.RecoveryHandler(raisesError))
```

You can use the above snippet to verify the SDK integration by visiting the above route in your application and verifying the error in GlitchTip.

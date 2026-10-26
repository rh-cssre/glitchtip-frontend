Install the [swift-sentry](https://github.com/nicklama/swift-sentry) package.

Add it to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/nicklama/swift-sentry.git", from: "0.5.0")
]
```

Initialize the SDK:

```swift
import Sentry

let dsn = ProcessInfo.processInfo.environment["SENTRY_DSN"] ?? "YOUR_DSN"
let sentry = try Sentry(dsn: dsn)
```

Capture errors:

```swift
do {
    try riskyOperation()
} catch {
    try await sentry.capture(error: error)
}
```

Shut down cleanly:

```swift
try await sentry.close()
```

## Tips

- For iOS/macOS apps, consider using the [Cocoa SDK](/sdkdocs/cocoa) instead — it provides richer context including crash reporting.
- This SDK is best suited for server-side Swift applications.
- Set the DSN via the `SENTRY_DSN` environment variable to avoid hardcoding it.

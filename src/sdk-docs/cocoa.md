Install the sentry Cocoa SDK using Swift Package Manager.

In Xcode, go to **File > Add Package Dependencies** and enter:

```
https://github.com/getsentry/sentry-cocoa
```

Or using CocoaPods:

```ruby
pod 'Sentry'
```

## Swift

Initialize the SDK in your `AppDelegate`:

```swift
import Sentry

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    SentrySDK.start { options in
        options.dsn = "YOUR_DSN"
        options.tracesSampleRate = 0.01 // 1% of transactions
        options.enableAutoSessionTracking = false // GlitchTip does not support sessions
    }

    return true
}
```

## Objective-C

```objc
@import Sentry;

[SentrySDK startWithConfigureOptions:^(SentryOptions *options) {
    options.dsn = @"YOUR_DSN";
    options.tracesSampleRate = @0.01;
    options.enableAutoSessionTracking = NO;
}];
```

## Debug Symbols

Upload dSYM files for readable crash stack traces using the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli debug-files upload ./build --org my-org --project my-project
```

## Tips

- Set `tracesSampleRate` to a low value. Mobile apps can generate many transactions.

Install the sentry Flutter SDK:

```bash
flutter pub add sentry_flutter
```

Initialize the SDK in `lib/main.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

void main() {
  SentryFlutter.init(
    (options) => options
      ..dsn = 'YOUR_DSN'
      ..tracesSampleRate = 0.01 // 1% of transactions
      ..enableAutoSessionTracking = false, // GlitchTip does not support sessions
    appRunner: () => runApp(MyApp()),
  );
}
```

Verify your setup:

```dart
try {
  throw Exception('Test GlitchTip error!');
} catch (exception, stackTrace) {
  Sentry.captureException(exception, stackTrace: stackTrace);
}
```

## Configuration

You can also set DSN and other options via environment variables with `--dart-define`:

```bash
flutter run --dart-define=SENTRY_DSN='YOUR_DSN'
```

## Debug Symbols

Upload Dart symbol maps for readable stack traces using the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli dart-symbol-map upload ./build/app.android-arm64.symbols ./build/app.android-arm64 --org my-org --project my-project
```

## Tips

- Flutter supports web, mobile, and desktop. The SDK captures errors on all platforms.
- Set `tracesSampleRate` to a low value in production to save disk space.

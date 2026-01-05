Flutter supports web, mobile, and desktop apps. GlitchTip can monitor errors on all platforms.

Install sentry_flutter

```bash
flutter pub add sentry_flutter
```

Edit `lib/main.dart` and add SentryFlutter.init

```dart
import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

void main() {
  SentryFlutter.init(
    (options) => options
      ..dsn='Your DSN here' // if hard coding GlitchTip DSN
      ..tracesSampleRate=0.01  // Performance trace 1% of events
      ..enableAutoSessionTracking=false,
    appRunner: () => runApp(MyApp())
  );
}

```

Set the following environment variables

- SENTRY_DSN - Your DSN here. Example: "https://0000@your-url/1"
- SENTRY_RELEASE - Example: "1.0"
- SENTRY_ENVIRONMENT - Example: "production"

For example with dart-define:

```bash
flutter run --dart-define=SENTRY_DSN='Your DSN here'
```

## Example exception

```dart
import 'package:sentry/sentry.dart';

...

try {
  throw new Exception('an exception');
} catch (exception, stackTrace) {
  Sentry.captureException(exception, stackTrace: stackTrace);
}
```

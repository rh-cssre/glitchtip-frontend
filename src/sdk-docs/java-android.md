Add the sentry Android SDK to your `app/build.gradle`:

```groovy
dependencies {
    implementation 'io.sentry:sentry-android:8.+'
}
```

Add the DSN to your `AndroidManifest.xml` inside the `<application>` element:

```xml
<application>
    <meta-data android:name="io.sentry.dsn" android:value="YOUR_DSN" />
    <meta-data android:name="io.sentry.traces.sample-rate" android:value="0.01" />
</application>
```

The SDK initializes automatically via a content provider — no code changes needed for basic setup.

Verify your setup in an Activity:

```kotlin
import io.sentry.Sentry

Sentry.captureException(Exception("Test GlitchTip error!"))
```

## Debug Symbols

Upload debug symbols for readable native crash stack traces using the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli debug-files upload ./app/build --org my-org --project my-project
```

## Tips

- Set `io.sentry.traces.sample-rate` to a low value. Mobile apps can generate many transactions.
- Use `io.sentry.release` and `io.sentry.environment` meta-data tags to track versions.

Add the sentry SDK to your project.

Using Gradle:

```groovy
implementation 'io.sentry:sentry:8.+'
```

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>LATEST</version>
</dependency>
```

Initialize the SDK as early as possible:

```java
import io.sentry.Sentry;

public class MyApp {
    public static void main(String[] args) {
        Sentry.init(options -> {
            options.setDsn("YOUR_DSN");
            options.setTracesSampleRate(0.01); // 1% of transactions
        });

        // Verify your setup
        try {
            throw new Exception("Test GlitchTip error!");
        } catch (Exception e) {
            Sentry.captureException(e);
        }

        Sentry.flush(2000);
    }
}
```

## Configuration

You can also configure the SDK via environment variables or a `sentry.properties` file:

- `SENTRY_DSN` — Your GlitchTip DSN
- `SENTRY_RELEASE` — Your application version
- `SENTRY_ENVIRONMENT` — The environment name (e.g., `production`)

## Tips

- Call `Sentry.flush()` before your application exits to ensure events are sent.
- Set `tracesSampleRate` to a low value in production to save disk space.

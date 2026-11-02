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

Configure the `SentryHandler` in your `logging.properties`:

```ini
handlers=java.util.logging.ConsoleHandler,io.sentry.jul.SentryHandler

.level=INFO

io.sentry.jul.SentryHandler.level=WARNING
```

Start your application with the logging config:

```bash
java -Djava.util.logging.config.file=/path/to/logging.properties MyClass
```

Set your DSN via environment variable:

```bash
export SENTRY_DSN="YOUR_DSN"
```

Log messages at `WARNING` level and above will be sent to GlitchTip as error events.

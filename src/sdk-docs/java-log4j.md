Add the sentry Log4j 1.x integration to your project.

Using Gradle:

```groovy
implementation 'io.sentry:sentry-log4j:8.+'
```

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j</artifactId>
    <version>LATEST</version>
</dependency>
```

Configure the `SentryAppender` in your `log4j.properties`:

```ini
log4j.rootLogger=INFO, Console, Sentry

log4j.appender.Console=org.apache.log4j.ConsoleAppender
log4j.appender.Console.layout=org.apache.log4j.PatternLayout
log4j.appender.Console.layout.ConversionPattern=%d{HH:mm:ss.SSS} [%t] %-5p: %m%n

log4j.appender.Sentry=io.sentry.log4j.SentryAppender
log4j.appender.Sentry.threshold=WARN
```

Set your DSN via environment variable:

```bash
export SENTRY_DSN="YOUR_DSN"
```

Log messages at `WARN` level and above will be sent to GlitchTip as error events.

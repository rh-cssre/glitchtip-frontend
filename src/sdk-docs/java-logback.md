Add the sentry Logback integration to your project.

Using Gradle:

```groovy
implementation 'io.sentry:sentry-logback:8.+'
```

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>LATEST</version>
</dependency>
```

Configure the `SentryAppender` in your `logback.xml`:

```xml
<configuration>
    <appender name="Console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="Sentry" class="io.sentry.logback.SentryAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>WARN</level>
        </filter>
    </appender>

    <root level="INFO">
        <appender-ref ref="Console" />
        <appender-ref ref="Sentry" />
    </root>
</configuration>
```

Set your DSN via environment variable:

```bash
export SENTRY_DSN="YOUR_DSN"
```

Log messages at `WARN` level and above will be sent to GlitchTip as error events.

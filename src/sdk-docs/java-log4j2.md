Add the sentry Log4j 2 integration to your project.

Using Gradle:

```groovy
implementation 'io.sentry:sentry-log4j2:8.+'
```

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j2</artifactId>
    <version>LATEST</version>
</dependency>
```

Configure the `Sentry` appender in your `log4j2.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="warn" packages="org.apache.logging.log4j.core,io.sentry.log4j2">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
        </Console>
        <Sentry name="Sentry" />
    </Appenders>

    <Loggers>
        <Root level="INFO">
            <AppenderRef ref="Console" />
            <AppenderRef ref="Sentry" level="WARN" />
        </Root>
    </Loggers>
</Configuration>
```

Set your DSN via environment variable:

```bash
export SENTRY_DSN="YOUR_DSN"
```

Log messages at `WARN` level and above will be sent to GlitchTip as error events.

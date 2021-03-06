### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-appengine</artifactId>
    <version>1.7.27</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-appengine:1.7.27'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-appengine" % "1.7.27"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-appengine%7C1.7.27%7Cjar).

### Usage

This module provides a new `SentryClientFactory` implementation which replaces the default async system with a Google App Engine compatible one. You’ll need to configure the SDK to use the `io.sentry.appengine.AppEngineSentryClientFactory` as its factory.

The queue size and thread options will not be used as they are specific to the default Java threading system.

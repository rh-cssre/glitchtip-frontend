### Installation

Using Gradle (Android Studio) in your `app/build.gradle` add:

```groovy
implementation 'io.sentry:sentry-android:1.7.27'

// this dependency is not required if you are already using your own
// slf4j implementation
implementation 'org.slf4j:slf4j-nop:1.7.25'
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-android%7C1.7.27%7Cjar).

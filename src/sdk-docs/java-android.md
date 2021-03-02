### Configure your Gradle file

In your top-level build.gradle file, make sure that Maven Central is added as a repository:

```groovy
repositories {
    mavenCentral()
}
```

In your `app/build.gradle` file, make sure that you're targeting Java 1.8 (8) compatibility:

```groovy
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

Then, add `sentry-android` into your dependencies:

```groovy
dependencies {
    implementation 'io.sentry:sentry-android:4.2.0'
}
```

For other dependency managers, see the [central Maven repository](https://search.maven.org/artifact/io.sentry/sentry-android/4.2.0/jar).

### Configure your Android manifest

Add this `<meta-data>` tag inside the `<application>` element of your AndroidManifest.xml file:

```xml
<application>
  <meta-data android:name="io.sentry.dsn" android:value="your DSN here" />
</application>
```

### Send us an error!

Open up `MainActivity.java`, and throw an exception:

```java
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import java.lang.Exception;
import io.sentry.Sentry;

public class MainActivity extends AppCompatActivity {
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
      throw new Exception("Hello, GlitchTip!");
    } catch (Exception exception) {
      Sentry.captureException(exception);
    }
  }
}
```

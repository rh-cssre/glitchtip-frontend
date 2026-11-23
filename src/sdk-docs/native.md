The Native SDK supports C and C++ applications. Download the latest release from the [GitHub releases page](https://github.com/getsentry/sentry-native/releases).

## Setup

Initialize the SDK early in your application:

```c
#include <sentry.h>

int main(void) {
    sentry_options_t *options = sentry_options_new();
    sentry_options_set_dsn(options, "YOUR_DSN");
    sentry_options_set_sample_rate(options, 0.01); // 1% of transactions
    sentry_init(options);

    /* Your application code */

    sentry_close();
}
```

**Important:** Call `sentry_close()` before exiting. This ensures pending events are flushed.

## Verify

```c
sentry_capture_event(sentry_value_new_message_event(
    SENTRY_LEVEL_INFO,
    "custom",
    "Test GlitchTip error!"
));
```

## Debug Symbols

Upload debug symbols (dSYM, PDB, ELF) for readable stack traces using the [GlitchTip CLI](/documentation/cli):

```bash
glitchtip-cli debug-files upload ./build --org my-org --project my-project
```

## Tips

- The DSN can also be set via the `SENTRY_DSN` environment variable.
- The SDK supports Breakpad and Crashpad backends for crash reporting.

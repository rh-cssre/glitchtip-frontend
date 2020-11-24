The Native SDK is intended for C and C++. However, since it builds as a
dynamic library and exposes C-bindings, it can be used by any language that
supports interoperability with C, such as the Foreign Function Interface (FFI).

### Building the SDK

To build the SDK, download the latest release of the SDK from the [Releases
page](https://github.com/getsentry/sentry-native/releases). For each supported
platform, there is a `gen_*` subfolder that contains build files:

**Windows**

: `gen_windows` contains a Microsoft Visual Studio 2017 solution. Open the
solution and add your projects or copy the projects to an existing solution.
Each project supports a debug and release configuration and includes all
sources required for building.

**Linux and macOS**

: `gen_linux` and `gen_macos` contain Makefiles that can be used to produce
dynamic libraries. Run `make help` to see an overview of the available
configurations and target. There are debug and release configurations, that
can be toggled when building:

```bash
make config=release sentry
```

There are multiple available targets to build:

- `sentry`: Builds the Native SDK built as a dynamic library.
- `sentry_breakpad`: Builds the Native SDK with Google Breakpad as a dynamic
  library.
- `sentry_crashpad`: Builds the Native SDK with Google Crashpad as a dynamic
  library.
- `crashpad_*`: Builds crashpad utilities. To run the Crashpad distribution of
  the SDK, you must build `crashpad_handler` and ship it with your application.

### Connecting the SDK to GlitchTip

Import and initialize the SDK early in your application setup:

```c
#include <sentry.h>

int main(void) {
  sentry_options_t *options = sentry_options_new();
  sentry_options_set_dsn(options, "your DSN here");
  sentry_init(options);

  /* ... */

  // make sure everything flushes
  sentry_shutdown();
}
```

### Note

Calling `sentry_shutdown()` before exiting the application is critical. It
ensures that events can be sent to Sentry before execution stops. Otherwise,
event data may be lost.

Alternatively, the DSN can be passed as `SENTRY_DSN` environment variable during
runtime. This can be especially useful for server applications.

### Verifying Your Setup

Now that SDK setup is complete, verify that all configuration is correct. Start
by capturing a manual event:

```c
sentry_capture_event(sentry_value_new_message_event(
  /*   level */ SENTRY_LEVEL_INFO,
  /*  logger */ "custom",
  /* message */ "It works!"
));
```

Once the event is captured, it will show up on the Sentry dashboard.

To start using GlitchTip, you need to:

1. Install a library into your project so it is able to send events to GlitchTip.
2. Configure it with a Data Source Name (DSN) so it knows where exactly to send events. Your DSN is below, and can also be found in the project's settings.
3. Initialize the library with your DSN to start sending events.

## General Configuration

Consult your platform's Sentry SDK's documentation for more information. Most support:

- dsn - Where to send event data too, found in GlitchTip in project settings.
- release - Set release name such as "1.0".
- environment - Set the running environment name, such as "production".

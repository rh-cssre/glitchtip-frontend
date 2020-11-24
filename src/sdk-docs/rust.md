To add GlitchTip to your Rust project you need to add a new dependency to your `Cargo.toml`:

```toml
[dependencies]
sentry = 'current version number'
```

`sentry.init()` will return you a guard that when freed, will prevent process exit until all events have been sent (within a timeout):

```rust
let _guard = sentry::init("your DSN here");
```

The quickest way to verify Sentry in your Rust application is to cause a panic:

```rust
fn main() {
    // Initialize sentry here
    sentry::integrations::panic::register_panic_handler();

    // GlitchTip will capture this
    panic!("Everything is on fire!");
}
```

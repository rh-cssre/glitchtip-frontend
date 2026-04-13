Add the sentry Rust SDK to your project:

```bash
cargo add sentry
```

Initialize the SDK in your `main.rs`:

```rust
fn main() {
    let _guard = sentry::init(("YOUR_DSN", sentry::ClientOptions {
        release: sentry::release_name!(),
        traces_sample_rate: 0.01, // 1% of transactions
        ..Default::default()
    }));

    // Your application code here
}
```

The `_guard` ensures events are flushed when it goes out of scope. Do not drop it early.

Verify your setup:

```rust
sentry::capture_message("Test GlitchTip error", sentry::Level::Error);
```

## Tips

- The `release_name!()` macro automatically sets the release to your crate version.
- Panics are captured automatically when using the default integrations.
- Set `traces_sample_rate` to a low value in production to save disk space.

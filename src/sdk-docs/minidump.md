## Platform and Language Support

Sentry currently supports minidumps for Windows, macOS and Linux. There is no limitation as to which programming language you can use. Sentry can also demangle symbols from the following languages:

- C and C++
- ObjectiveC and ObjectiveC++
- Swift
- Rust

Languages not listed above will show the mangled name instead.

## Creating and Uploading Minidumps

Depending on your operating system and programming language, there are various
alternatives to create minidumps and upload them to Sentry.

<!--
See the following resources for libraries that support generating minidump crash reports:

- [Native SDK]({%- link _documentation/platforms/native/index.md -%})
- [Google Breakpad]({%- link _documentation/platforms/native/breakpad.md -%})
- [Google Crashpad]({%- link _documentation/platforms/native/crashpad.md -%})
-->

If you have already integrated a library that generates minidumps and would just
like to upload them to Sentry, you need to configure the _Minidump Endpoint
URL_, which can be found at _Project Settings > Client Keys (DSN)_. This
endpoint expects a `POST` request with the minidump in the
`upload_file_minidump` field:

```bash
$ curl -X POST \
  '___MINIDUMP_URL___' \
  -F upload_file_minidump=@mini.dmp
```

To send additional information, add more form fields to this request.

<!--For a full description of fields accepted by Sentry, see [Passing Additional Data](#minidump-additional).-->

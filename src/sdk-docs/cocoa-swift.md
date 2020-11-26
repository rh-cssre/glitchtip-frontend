## Installation

The SDK can be installed using [CocoaPods](http://cocoapods.org) or [Carthage](https://github.com/Carthage/Carthage). This is the recommended client for both Swift and Objective-C.

We recommend installing SDK with CocoaPods.

To integrate the SDK into your Xcode project using CocoaPods, specify it in your _Podfile_:

```ruby
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '8.0'
use_frameworks!

target 'YourApp' do
    pod 'Sentry', :git => 'https://github.com/getsentry/sentry-cocoa.git'
end
```

Afterwards run `pod install`. In case you encounter problems with dependencies and you are on a newer CocoaPods you might have to run `pod repo update` first.

To integrate Sentry into your Xcode project using Carthage, specify it in your _Cartfile_:

```ruby
github "getsentry/sentry-cocoa"
```

Run `carthage update` to download the framework and drag the built _Sentry.framework_ into your Xcode project.

We also provide a pre-built version for every release which can be downloaded at [releases on GitHub](https://github.com/getsentry/sentry-cocoa/releases).

## Configuration

To use the client, change your AppDelegate’s _application_ method to instantiate the SDK:

```swift
import Sentry

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // Create a client and start crash handler
    do {
        Client.shared = try Client(dsn: "your DSN here")
        try Client.shared?.startCrashHandler()
    } catch let error {
        print("\(error)")
    }

    return true
}
```

If you prefer to use Objective-C you can do so like this:

```objc
@import Sentry;

NSError *error = nil;
SentryClient *client = [[SentryClient alloc] initWithDsn:@"your DSN here" didFailWithError:&error];
SentryClient.sharedClient = client;
[SentryClient.sharedClient startCrashHandlerWithError:&error];
if (nil != error) {
    NSLog(@"%@", error);
}
```

## Debug Symbols

Before you can start capturing crashes you will need to tell the SDK about the debug information by uploading dSYM files. Depending on your setup this can be done in different ways.

<!--
- [With Bitcode]({%- link _documentation/clients/cocoa/dsym.md -%}#dsym-with-bitcode)
- [Without Bitcode]({%- link _documentation/clients/cocoa/dsym.md -%}#dsym-without-bitcode)
-->

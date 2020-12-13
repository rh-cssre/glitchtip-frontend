## Installation

Start by adding the SDK and then linking it:

```bash
$ npm install react-native-sentry --save
# or
# yarn add react-native-sentry
# if you are using yarn
# this is for linking
$ react-native link react-native-sentry
```

The _link_ step will pull in the native dependency and patch your project accordingly. <!--If you are using expo you don’t have to (or can’t) run that link step. For more information about that see [_Using Sentry with Expo_]({%- link _documentation/clients/react-native/expo.md -%}). On linking the new [Sentry Wizard](https://github.com/getsentry/sentry-wizard) will help you to configure your project and change files accordingly. -->

Upon linking the following changes will be performed:

- add the sentry-java package for native crash reporting on Android
- add the sentry-cocoa package for native crash reporting on iOS
- enable the sentry gradle build step for android
- patch _AppDelegate.m_ for iOS
- patch _MainApplication.java_ for Android
- configure the SDK for the supplied DSN in your _index.js/App.js_ files
- store build credentials in _ios/sentry.properties_ and _android/sentry.properties_.

## Client Configuration

When you run `react-native link` we will automatically update your _index.ios.js_ / _index.android.js_ with the following changes:

```javascript
import { Sentry } from "react-native-sentry";
Sentry.config("your DSN here").install();
```

You can pass additional configuration options to the `config()` method if you want to do so.

import { describe, it, expect } from "vitest";
import {
  isStacktrace,
  isIosPlatform,
  cleanIosPath,
  isSwiftNameMangled,
} from "./utils";

/**
 * These helpers drive how iOS/Swift crash frames are rendered in the issue
 * detail view. They run against arbitrary user-uploaded event payloads, so the
 * interesting cases are the messy real-world ones: absurdly long absolute
 * bundle paths that need trimming, and mangled Swift symbol names we must
 * detect before attempting to demangle. Pure string logic — fast and worth
 * locking down so a rendering regression shows up here, not in the UI.
 */

describe("isStacktrace", () => {
  it("treats an object with a `frames` property as a stacktrace", () => {
    expect(isStacktrace({ frames: [] })).toBe(true);
  });

  it("rejects null, undefined, and frame-less objects", () => {
    expect(isStacktrace(null)).toBe(false);
    expect(isStacktrace(undefined)).toBe(false);
    expect(isStacktrace({})).toBe(false);
  });
});

describe("isIosPlatform", () => {
  it("recognizes the cocoa/objc platforms", () => {
    expect(isIosPlatform("cocoa")).toBe(true);
    expect(isIosPlatform("objc")).toBe(true);
  });

  it("returns false for other or missing platforms", () => {
    expect(isIosPlatform("python")).toBe(false);
    expect(isIosPlatform(null)).toBe(false);
  });
});

describe("cleanIosPath", () => {
  it("trims an absolute device path down to the app-bundle-relative portion", () => {
    const full =
      "/private/var/containers/Bundle/Application/" +
      "0F3C-DEAD-BEEF/MyApp.app/Frameworks/Foo.framework/Foo";

    // Keeps everything from the first bundle container onward, so the frame is
    // shown relative to the app bundle rather than the device's absolute path.
    expect(cleanIosPath(full)).toBe("MyApp.app/Frameworks/Foo.framework/Foo");
  });

  it("handles each recognized bundle container suffix", () => {
    expect(cleanIosPath("/a/b/MyApp.app/MyApp")).toBe("MyApp.app/MyApp");
    expect(cleanIosPath("/x/Ext.appex/Ext")).toBe("Ext.appex/Ext");
    expect(cleanIosPath("/x/Res.bundle/image.png")).toBe(
      "Res.bundle/image.png",
    );
    expect(cleanIosPath("/x/Tests.xctest/Tests")).toBe("Tests.xctest/Tests");
  });

  it("returns the path unchanged when no bundle container is present", () => {
    expect(cleanIosPath("/usr/lib/system/libsystem.dylib")).toBe(
      "/usr/lib/system/libsystem.dylib",
    );
  });
});

describe("isSwiftNameMangled", () => {
  it("detects mangled Swift symbols on iOS platforms", () => {
    expect(isSwiftNameMangled("$s4MyApp10ViewController", "cocoa")).toBe(true);
    expect(isSwiftNameMangled("_$s4MyApp3FooV", "cocoa")).toBe(true);
  });

  it("does not flag already-demangled names", () => {
    expect(isSwiftNameMangled("MyApp.ViewController.viewDidLoad()", "cocoa")).toBe(
      false,
    );
  });

  it("only applies on iOS platforms", () => {
    // Same `$s` prefix, but a non-iOS platform must not be treated as Swift.
    expect(isSwiftNameMangled("$s4MyApp", "python")).toBe(false);
  });

  it("is safe with null inputs", () => {
    expect(isSwiftNameMangled(null, "cocoa")).toBe(false);
    expect(isSwiftNameMangled("$s4MyApp", null)).toBe(false);
  });
});

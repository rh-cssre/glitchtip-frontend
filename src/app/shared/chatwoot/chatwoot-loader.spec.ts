import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SDK_SRC = "https://app.chatwoot.com/packs/js/sdk.js";

type Loader = typeof import("./chatwoot-loader");

/**
 * The loader must inject the SDK at most once, recover from a blocked script,
 * and still finish loading if the widget becomes ready after the timeout.
 */
describe("chatwoot-loader", () => {
  let loader: Loader;
  const chatwoot = {
    hasLoaded: true,
    toggle: vi.fn(),
    reset: vi.fn(),
    setUser: vi.fn(),
    setCustomAttributes: vi.fn(),
    setConversationCustomAttributes: vi.fn(),
  };

  const sdkScripts = () =>
    [...document.querySelectorAll<HTMLScriptElement>("script")].filter(
      (s) => s.src === SDK_SRC,
    );

  /** Simulate the SDK script loading and its iframe becoming ready. */
  function finishLoading(script = sdkScripts()[0]) {
    window.chatwootSDK = {
      run: () => {
        window.$chatwoot = chatwoot;
      },
    };
    script.onload?.(new Event("load"));
    window.dispatchEvent(new Event("chatwoot:ready"));
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    loader = await import("./chatwoot-loader");
  });

  afterEach(() => {
    sdkScripts().forEach((s) => s.remove());
    delete window.$chatwoot;
    delete window.chatwootSDK;
    localStorage.clear();
    document.cookie = "cw_conversation=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("loads the SDK once, however many times it is asked", async () => {
    const first = loader.loadChatwoot("token");
    const second = loader.loadChatwoot("token");
    finishLoading();
    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(true);
    await expect(loader.loadChatwoot("token")).resolves.toBe(true);
    expect(sdkScripts()).toHaveLength(1);
  });

  it("removes a blocked script so a later attempt starts clean", async () => {
    const blocked = loader.loadChatwoot("token");
    sdkScripts()[0].onerror?.(new Event("error"));
    await expect(blocked).resolves.toBe(false);
    expect(sdkScripts()).toHaveLength(0);

    const retry = loader.loadChatwoot("token");
    expect(sdkScripts()).toHaveLength(1);
    finishLoading();
    await expect(retry).resolves.toBe(true);
  });

  it("recovers when the widget becomes ready after the timeout", async () => {
    const onReady = vi.fn();
    loader.onChatwootReady(onReady);

    const slow = loader.loadChatwoot("token");
    await vi.advanceTimersByTimeAsync(loader.CHATWOOT_LOAD_TIMEOUT_MS);
    await expect(slow).resolves.toBe(false);

    finishLoading();
    expect(onReady).toHaveBeenCalledOnce();
    await expect(loader.loadChatwoot("token")).resolves.toBe(true);
    expect(sdkScripts()).toHaveLength(1);
  });

  it("remembers that the chat was opened, but not merely loaded", async () => {
    const loaded = loader.loadChatwoot("token");
    finishLoading();
    await loaded;
    expect(loader.hasOpenedSupportChat()).toBe(false);

    await loader.openChatwoot("token");
    expect(chatwoot.toggle).toHaveBeenCalledWith("open");
    expect(loader.hasOpenedSupportChat()).toBe(true);
  });

  it("ignores Chatwoot's own cookie when deciding to resume", () => {
    document.cookie = "cw_conversation=abc";
    expect(loader.hasOpenedSupportChat()).toBe(false);
  });

  it("forgets the chat session on reset", async () => {
    const opened = loader.openChatwoot("token");
    finishLoading();
    await opened;
    document.cookie = "cw_conversation=abc";

    loader.resetSupportChat();

    expect(loader.hasOpenedSupportChat()).toBe(false);
    expect(chatwoot.reset).toHaveBeenCalled();
    expect(document.cookie).not.toContain("cw_conversation");
  });
});

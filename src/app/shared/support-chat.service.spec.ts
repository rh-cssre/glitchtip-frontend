import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SupportChatService } from "./support-chat.service";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";
import { OrganizationsService } from "../api/organizations.service";
import { SubscriptionService } from "../api/subscriptions/subscription.service";

const SDK_SRC = "https://app.chatwoot.com/packs/js/sdk.js";

/**
 * The support chat must not load any third-party script, or tell Chatwoot who
 * the user is, until the user opens it (or already has a conversation).
 */
describe("SupportChatService", () => {
  const websiteToken = signal<string | null>("website-token");
  const chatwoot = {
    toggle: vi.fn(),
    setUser: vi.fn(),
    setCustomAttributes: vi.fn(),
  };

  const sdkScripts = () =>
    [...document.querySelectorAll<HTMLScriptElement>("script")].filter(
      (s) => s.src === SDK_SRC,
    );

  /** Simulate the SDK script loading and its iframe becoming ready. */
  function finishLoading(script: HTMLScriptElement) {
    window.chatwootSDK = {
      run: () => {
        window.$chatwoot = chatwoot;
      },
    };
    script.onload?.(new Event("load"));
    window.dispatchEvent(new Event("chatwoot:ready"));
  }

  function create() {
    const service = TestBed.inject(SupportChatService);
    TestBed.tick();
    return service;
  }

  beforeEach(() => {
    websiteToken.set("website-token");
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SettingsService,
          useValue: { chatwootWebsiteToken: websiteToken },
        },
        {
          provide: UserService,
          useValue: {
            user: signal({
              id: 7,
              email: "dev@example.com",
              chatwootIdentifierHash: "hash",
            }),
          },
        },
        {
          provide: OrganizationsService,
          useValue: { activeOrganizationSlug: signal("acme") },
        },
        {
          provide: SubscriptionService,
          useValue: { subscription: signal(null) },
        },
      ],
    });
  });

  afterEach(() => {
    sdkScripts().forEach((s) => s.remove());
    delete window.$chatwoot;
    delete window.chatwootSDK;
    document.cookie = "cw_conversation=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("loads nothing for a visitor who has never chatted", () => {
    create();
    expect(sdkScripts()).toHaveLength(0);
  });

  it("is unavailable when the instance has no Chatwoot token", () => {
    websiteToken.set(null);
    expect(create().available()).toBe(false);
  });

  it("loads, identifies, and opens the chat on a single click", async () => {
    const service = create();
    const opened = service.open();
    expect(service.opening()).toBe(true);

    const [script] = sdkScripts();
    finishLoading(script);

    await expect(opened).resolves.toBe(true);
    expect(service.opening()).toBe(false);
    expect(chatwoot.setUser).toHaveBeenCalledWith(7, {
      email: "dev@example.com",
      identifier_hash: "hash",
    });
    expect(chatwoot.setCustomAttributes).toHaveBeenCalledWith({
      organizationSlug: "acme",
      plan: "free",
      planStatus: "free",
    });
    expect(chatwoot.toggle).toHaveBeenCalledWith("open");
  });

  it("injects the script only once across repeated opens", async () => {
    const service = create();
    const first = service.open();
    finishLoading(sdkScripts()[0]);
    await first;
    await service.open();
    expect(sdkScripts()).toHaveLength(1);
    expect(chatwoot.toggle).toHaveBeenCalledTimes(2);
  });

  it("reports failure when the script is blocked, and retries next time", async () => {
    const service = create();
    const opened = service.open();
    sdkScripts()[0].onerror?.(new Event("error"));
    await expect(opened).resolves.toBe(false);
    expect(chatwoot.toggle).not.toHaveBeenCalled();

    sdkScripts()[0].remove();
    service.open();
    expect(sdkScripts()).toHaveLength(1);
  });

  it("gives up after a timeout if the widget never becomes ready", async () => {
    vi.useFakeTimers();
    const service = create();
    const opened = service.open();
    await vi.advanceTimersByTimeAsync(8000);
    await expect(opened).resolves.toBe(false);
  });

  it("restores the widget for someone with an existing conversation", () => {
    document.cookie = "cw_conversation=abc";
    create();
    expect(sdkScripts()).toHaveLength(1);
    expect(chatwoot.toggle).not.toHaveBeenCalled();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";

const SDK_SRC = "https://app.chatwoot.com/packs/js/sdk.js";

/**
 * Nothing is sent to Chatwoot until the user opens the chat, and once it is
 * open the user's identity follows them across org switches and sign-out.
 */
describe("SupportChatService", () => {
  const websiteToken = signal<string | null>("website-token");
  const user = signal<{
    id: number;
    email: string;
    chatwootIdentifierHash: string | null;
  } | null>(null);
  const orgSlug = signal<string | null>("acme");
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

  function finishLoading() {
    window.chatwootSDK = {
      run: () => {
        window.$chatwoot = chatwoot;
      },
    };
    sdkScripts()[0].onload?.(new Event("load"));
    window.dispatchEvent(new Event("chatwoot:ready"));
  }

  async function create() {
    // The loader keeps module-level state, so give each test fresh modules.
    // DI tokens must come from the same fresh import as the service.
    vi.resetModules();
    const { SupportChatService } = await import("./support-chat.service");
    const { SettingsService } = await import("../api/settings.service");
    const { UserService } = await import("../api/user/user.service");
    const { OrganizationsService } = await import("../api/organizations.service");
    const { SubscriptionService } = await import(
      "../api/subscriptions/subscription.service"
    );
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SettingsService,
          useValue: { chatwootWebsiteToken: websiteToken },
        },
        { provide: UserService, useValue: { user } },
        {
          provide: OrganizationsService,
          useValue: { selectedOrganizationSlug: orgSlug },
        },
        {
          provide: SubscriptionService,
          useValue: { subscription: signal(null) },
        },
      ],
    });
    const service = TestBed.inject(SupportChatService);
    TestBed.tick();
    return service;
  }

  async function openChat() {
    const service = await create();
    const opened = service.open();
    finishLoading();
    await opened;
    return service;
  }

  beforeEach(() => {
    websiteToken.set("website-token");
    user.set({
      id: 7,
      email: "dev@example.com",
      chatwootIdentifierHash: "hash",
    });
    orgSlug.set("acme");
  });

  afterEach(() => {
    sdkScripts().forEach((s) => s.remove());
    delete window.$chatwoot;
    delete window.chatwootSDK;
    localStorage.clear();
    document.cookie = "cw_conversation=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    vi.clearAllMocks();
  });

  it("loads nothing for someone who has never opened the chat", async () => {
    // Chatwoot sets this as soon as its widget loads, so it is no sign of use.
    document.cookie = "cw_conversation=abc";
    await create();
    expect(sdkScripts()).toHaveLength(0);
  });

  it("is unavailable when the instance has no Chatwoot token", async () => {
    websiteToken.set(null);
    expect((await create()).available()).toBe(false);
  });

  it("identifies the user before opening the chat", async () => {
    const service = await create();
    const opened = service.open();
    expect(service.opening()).toBe(true);
    finishLoading();
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
    expect(chatwoot.setUser.mock.invocationCallOrder[0]).toBeLessThan(
      chatwoot.toggle.mock.invocationCallOrder[0],
    );
  });

  it("updates the org on switch, without re-sending unchanged identity", async () => {
    await openChat();
    TestBed.tick();
    expect(chatwoot.setUser).toHaveBeenCalledOnce();

    orgSlug.set("globex");
    TestBed.tick();
    expect(chatwoot.setCustomAttributes).toHaveBeenLastCalledWith(
      expect.objectContaining({ organizationSlug: "globex" }),
    );
    expect(chatwoot.setCustomAttributes).toHaveBeenCalledTimes(2);
  });

  it("drops the identity if the user signs out without a reload", async () => {
    await openChat();
    user.set(null);
    TestBed.tick();
    expect(chatwoot.reset).toHaveBeenCalledOnce();
  });

  it("restores the widget for someone who has opened the chat before", async () => {
    localStorage.setItem("glitchtip-support-chat-opened", "1");
    await create();
    expect(sdkScripts()).toHaveLength(1);
    expect(chatwoot.toggle).not.toHaveBeenCalled();
  });
});

// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder, and the app build picks the
// type up via main.ts, which the spec tsconfig does not include.
import type {} from "@angular/localize/init";
import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UpgradeBannerComponent } from "./upgrade-banner.component";
import type { OverageThrottleState } from "src/app/api/subscriptions/overage-throttle-state";

describe("UpgradeBannerComponent throttle states", () => {
  let fixture: ComponentFixture<UpgradeBannerComponent>;

  /** A throttled paid org with a bigger plan to sell, unless overridden. */
  function render(
    state: OverageThrottleState,
    inputs: Record<string, unknown> = {},
  ) {
    fixture.componentRef.setInput("throttleState", state);
    fixture.componentRef.setInput("eventThrottleRate", 10);
    fixture.componentRef.setInput("isAcceptingEvents", true);
    fixture.componentRef.setInput("nextPlanEvents", 500_000);
    fixture.componentRef.setInput("plansLoaded", true);
    fixture.componentRef.setInput("contactEmail", "sales@example.com");
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? "";
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeBannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(UpgradeBannerComponent);
  });

  it("renders nothing while a change is taking effect (throttled)", () => {
    // The card below owns the transient notice; a banner here sold an
    // upgrade for a lag the server clears on its own.
    const text = render("throttled");
    expect(text.trim()).toBe("");
  });

  it("renders nothing while the throttle diagnosis has not arrived", () => {
    const text = render("unknown");
    expect(text.trim()).toBe("");
  });

  it("keeps the plain pitch, naming no overage control, when the diagnosis failed to load", () => {
    // The overage card hides itself on the same failure, so dropping this
    // banner too would leave a throttled org with nothing at all. Whether the
    // cap or the toggle would help is unknown, so neither is named.
    const text = render("unknown", { throttleStateUnavailable: true });
    expect(text).toContain("Upgrade to restore full coverage");
    expect(text).toContain("Upgrade to 500k events/mo");
    expect(text).not.toContain("Raise your cap");
    expect(text).not.toContain("turn on on-demand billing below");
  });

  it("stays quiet on a failed diagnosis when nothing is being dropped", () => {
    const text = render("unknown", {
      throttleStateUnavailable: true,
      eventThrottleRate: 0,
    });
    expect(text).not.toContain("being dropped");
  });

  it("points a largest-plan org at the cap and a conversation, not an upgrade", () => {
    const text = render("cap", { nextPlanEvents: null });
    expect(text).toContain("Raise your cap below");
    expect(text).toContain("get in touch");
    expect(text).not.toContain("Upgrade to");
    expect(text).toContain("Contact us");
  });

  it("offers upgrade or the overage toggle when overage is off", () => {
    const text = render("no-overage");
    expect(text).toContain("turn on on-demand billing below");
    expect(text).toContain("Upgrade");
  });

  it("sells nothing for a stall only we can fix", () => {
    const text = render("stalled-broken");
    expect(text).toContain("not being charged");
    expect(text).toContain("Contact us");
    expect(text).not.toContain("Upgrade to 500k events/mo");
  });

  it("keeps the plain upgrade pitch when overage is not on offer", () => {
    const text = render("unavailable");
    expect(text).toContain("Upgrade to restore full coverage");
    expect(text).toContain("Upgrade to 500k events/mo");
  });

  it("suspension outranks every throttle diagnosis", () => {
    const text = render("cap", { isAcceptingEvents: false });
    expect(text).toContain("Event collection is paused");
    expect(text).not.toContain("Raise your cap");
  });
});

describe("UpgradeBannerComponent for a paid org", () => {
  let fixture: ComponentFixture<UpgradeBannerComponent>;

  /** A throttled paid org with a bigger plan on offer, unless overridden. */
  function render(
    state: OverageThrottleState,
    inputs: Record<string, unknown> = {},
  ) {
    fixture.componentRef.setInput("paid", true);
    fixture.componentRef.setInput("throttleState", state);
    fixture.componentRef.setInput("eventThrottleRate", 10);
    fixture.componentRef.setInput("isAcceptingEvents", true);
    fixture.componentRef.setInput("nextPlanEvents", 500_000);
    fixture.componentRef.setInput("plansLoaded", true);
    fixture.componentRef.setInput("contactEmail", "sales@example.com");
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? "";
  }

  function buttons(): string[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll("button, a"),
    ).map((el) => el.textContent?.trim() ?? "");
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeBannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(UpgradeBannerComponent);
  });

  // Checkout creates a subscription next to the paid one, and the portal
  // cannot change the plan of one that has ever carried the metered item, so
  // every paid state offers a conversation.
  it("offers the on-demand toggle or a conversation, never Checkout", () => {
    const text = render("no-overage");
    expect(text).toContain("Turn on on-demand billing below");
    expect(text).toContain("get in touch to change your plan");
    expect(buttons()).toEqual(["Contact us"]);
  });

  it("keeps the plain pitch, as a conversation, when on-demand is not on offer", () => {
    const text = render("unavailable");
    expect(text).toContain(
      "Get in touch to change your plan and restore full coverage",
    );
    expect(buttons()).toEqual(["Contact us"]);
  });

  it("asks for a conversation when events are rejected outright", () => {
    const text = render("unavailable", { eventThrottleRate: 100 });
    expect(text).toContain(
      "Get in touch to change your plan and resume event tracking",
    );
    expect(buttons()).toEqual(["Contact us"]);
  });

  it("asks for a conversation when on-demand is on but the plan cannot use it", () => {
    render("stalled-plan");
    expect(buttons()).toEqual(["Contact us"]);
  });

  it("asks for a conversation when the diagnosis failed to load", () => {
    render("unknown", { throttleStateUnavailable: true });
    expect(buttons()).toEqual(["Contact us"]);
  });

  it("points an org at its cap to the cap control and a conversation", () => {
    const text = render("cap");
    expect(text).toContain("Raise your cap below");
    expect(text).toContain("get in touch");
    expect(buttons()).toEqual(["Contact us"]);
  });

  // The cap and the toggle are owner-only, so a member is sent to an owner
  // instead of to a control the card below shows read-only.
  it("sends a member at the cap to an owner", () => {
    const text = render("cap", { canManage: false });
    expect(text).toContain(
      "Ask an organization owner to raise the spend cap or change your plan",
    );
    expect(text).not.toContain("Raise your cap below");
  });

  it("sends a member with on-demand off to an owner", () => {
    const text = render("no-overage", { canManage: false });
    expect(text).toContain(
      "Ask an organization owner to turn on on-demand billing or change your plan",
    );
    expect(text).not.toContain("Turn on on-demand billing below");
  });

  it("gives a member the same copy as an owner when no owner control helps", () => {
    const text = render("unavailable", { canManage: false });
    expect(text).toContain(
      "Get in touch to change your plan and restore full coverage",
    );
  });
});

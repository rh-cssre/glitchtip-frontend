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

  it("keeps the plain pitch when the throttle diagnosis failed to load", () => {
    // The overage card hides itself on the same failure, so dropping this
    // banner too would leave a throttled org with nothing at all.
    const text = render("unknown", { throttleStateUnavailable: true });
    expect(text).toContain("Upgrade to restore full coverage");
    expect(text).toContain("Upgrade to 500k events/mo");
  });

  it("names no overage control when the throttle diagnosis failed to load", () => {
    const text = render("unknown", { throttleStateUnavailable: true });
    expect(text).not.toContain("Raise your cap");
    expect(text).not.toContain("turn on overage billing below");
  });

  it("stays quiet on a failed diagnosis when nothing is being dropped", () => {
    const text = render("unknown", {
      throttleStateUnavailable: true,
      eventThrottleRate: 0,
    });
    expect(text).not.toContain("being dropped");
  });

  it("offers both remedies at the spend cap", () => {
    const text = render("cap");
    expect(text).toContain("Raise your cap below");
    expect(text).toContain("upgrade for more included events");
    expect(text).toContain("Upgrade to 500k events/mo");
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
    expect(text).toContain("turn on overage billing below");
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

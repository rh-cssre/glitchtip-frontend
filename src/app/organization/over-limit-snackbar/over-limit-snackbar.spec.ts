// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder.
import type {} from "@angular/localize/init";
import { beforeEach, describe, expect, it } from "vitest";
import { computed, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { OverLimitSnackbar } from "./over-limit-snackbar";
import { OrganizationsService } from "src/app/api/organizations.service";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";
import type { OverageThrottleState } from "src/app/api/subscriptions/overage-throttle-state";

/**
 * A paid org cannot change plan itself yet, so the snackbar must never send it
 * to upgrade, while a free org still can.
 */
describe("OverLimitSnackbar remedy", () => {
  const throttleState = signal<OverageThrottleState>("unknown");
  // undefined: still loading; null: no subscription; number: its price.
  const price = signal<number | null | undefined>(undefined);
  const isOwner = signal(true);

  function render(
    state: OverageThrottleState,
    effectivePrice?: number | null,
    owner = true,
  ) {
    throttleState.set(state);
    price.set(effectivePrice);
    isOwner.set(owner);
    const fixture = TestBed.createComponent(OverLimitSnackbar);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? "";
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverLimitSnackbar],
      providers: [
        provideRouter([]),
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { activeOrgSlug: "org", throttleRate: 20 },
        },
        { provide: MatSnackBarRef, useValue: { dismiss: () => undefined } },
        {
          provide: OrganizationsService,
          useValue: { accessOrgAdmin: isOwner },
        },
        {
          provide: SubscriptionService,
          useValue: {
            throttleState,
            subscriptionResource: { hasValue: () => price() !== undefined },
            subscription: computed(() => {
              const p = price();
              return p == null ? null : { effectivePrice: p };
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it("offers a paid org at its cap a plan change, not an upgrade", () => {
    const text = render("cap", 15);
    expect(text).toContain("raise your spend cap or change your plan");
    expect(text).not.toContain("upgrade");
  });

  it("offers a paid org with on-demand off a plan change, not an upgrade", () => {
    const text = render("no-overage", 15);
    expect(text).toContain("turn on on-demand billing or change your plan");
    expect(text).not.toContain("upgrade");
  });

  it("sends a non-owner to an owner instead of to the cap or the toggle", () => {
    const atCap = render("cap", 15, false);
    expect(atCap).toContain(
      "ask an organization owner to raise the spend cap or change your plan",
    );
    expect(atCap).not.toContain("raise your spend cap");

    const noOverage = render("no-overage", 15, false);
    expect(noOverage).toContain(
      "ask an organization owner to turn on on-demand billing or change your plan",
    );
  });

  it("tells a paid org to change plan when nothing else helps", () => {
    expect(render("unavailable", 15)).toContain("to change your plan");
    expect(render("stalled-plan", 15)).toContain("to change your plan.");
  });

  it("still tells a free org to upgrade", () => {
    expect(render("unavailable", 0)).toContain("to upgrade");
    expect(render("unavailable", null)).toContain("to upgrade");
    expect(render("stalled-plan", 0)).toContain("to upgrade.");
  });

  it("names no plan action until the subscription loads", () => {
    const text = render("unavailable");
    expect(text).toContain("for details");
    expect(text).not.toContain("upgrade");
    expect(text).not.toContain("change your plan");
  });
});

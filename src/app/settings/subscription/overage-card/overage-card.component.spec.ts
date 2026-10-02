// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder, and the app build picks the
// type up via main.ts, which the spec tsconfig does not include.
import type {} from "@angular/localize/init";
import { beforeEach, describe, expect, it } from "vitest";
import { signal, computed } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OverageCardComponent } from "./overage-card.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";
import {
  capAdjustable,
  capBelowAccrued,
  capReached,
  isOverageInactive,
  overageInactiveCause,
  overageThrottleState,
} from "src/app/api/subscriptions/overage-throttle-state";
import type { components } from "src/app/api/api-schema";

type OverageStatus = components["schemas"]["OverageStatusSchema"];

/**
 * A paid org one cycle into $1.02 of overage against a $75 cap, which is the
 * shape both money disclosures are about.
 */
const status = (overrides: Partial<OverageStatus> = {}): OverageStatus => ({
  enabled: true,
  eligible: true,
  configured: true,
  active: true,
  capCents: 7500,
  maxCapCents: 1000000,
  capUnits: 441176,
  quota: 100000,
  usage: 106012,
  overageUnits: 6012,
  overageCostCents: 102,
  throttleRate: 0,
  ...overrides,
});

describe("OverageCardComponent money disclosures", () => {
  let fixture: ComponentFixture<OverageCardComponent>;
  const overageStatus = signal<OverageStatus | null>(status());

  /** Renders the card against `overrides` and returns its visible text. */
  function render(overrides: Partial<OverageStatus> = {}) {
    overageStatus.set(status(overrides));
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? "";
  }

  beforeEach(async () => {
    overageStatus.set(status());
    // The real service derives every one of these from the same status
    // resource, so the stub derives them from the same signal rather than
    // letting a test set an inconsistent pair.
    await TestBed.configureTestingModule({
      imports: [OverageCardComponent],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            overageStatus,
            subscription: signal(null),
            overageEnabled: computed(() => overageStatus()?.enabled ?? false),
            capProgressPercent: computed(() => {
              const s = overageStatus();
              if (!s || !s.capUnits) return 0;
              return Math.min(
                100,
                Math.round((s.overageUnits / s.capUnits) * 100),
              );
            }),
            capReached: computed(() => capReached(overageStatus())),
            willReachCap: signal(false),
            throttleRate: computed(() => overageStatus()?.throttleRate ?? 0),
            throttleState: computed(() =>
              overageThrottleState(overageStatus()),
            ),
            overageInactive: computed(() => isOverageInactive(overageStatus())),
            inactiveCause: computed(() =>
              overageInactiveCause(overageStatus()),
            ),
            canConfigureOverage: computed(() => capAdjustable(overageStatus())),
            overageConfigured: computed(
              () => overageStatus()?.configured ?? false,
            ),
            capBelowAccrued: computed(() => capBelowAccrued(overageStatus())),
            maxCapCents: computed(
              () => overageStatus()?.maxCapCents ?? 1000000,
            ),
            overageConfigLoading: signal(false),
            overageConfigError: signal(""),
          },
        },
        {
          provide: OrganizationsService,
          useValue: { accessOrgAdmin: signal(true) },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(OverageCardComponent);
  });

  it("prices the cycle while overage is on", () => {
    const text = render();
    expect(text).toContain("$1.02");
    expect(text).toContain("this cycle (estimate)");
  });

  it("promises nothing about an amount it can no longer price", () => {
    const text = render({
      enabled: false,
      active: false,
      overageCostCents: 0,
      throttleRate: 10,
    });
    expect(text).not.toContain("$1.02");
    expect(text).not.toContain("$0.00");
  });

  it("explains an estimate that sits above a lowered cap", () => {
    const text = render({ capCents: 100, capUnits: 5882, throttleRate: 10 });
    expect(text).toContain("cap is set below what this cycle has already used");
    expect(text).toContain("The estimate above is what you will be billed");
  });

  it("does not explain an overflow while the cap still covers the cycle", () => {
    const text = render();
    expect(text).not.toContain(
      "cap is set below what this cycle has already used",
    );
  });

  // The claim the cap-lowering path breaks: usage already served stays
  // billable, so only future overage is bounded.
  it("never promises the bill stays under the cap", () => {
    expect(render()).not.toContain("never goes over the cap");
    expect(render({ capCents: 100, capUnits: 5882 })).not.toContain(
      "never goes over the cap",
    );
  });
});

import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import type { OverageThrottleState } from "src/app/api/subscriptions/overage-throttle-state";

@Component({
  selector: "gt-upgrade-banner",
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: "./upgrade-banner.component.html",
  styleUrls: ["./upgrade-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradeBannerComponent {
  readonly usagePercent = input<number | null>(null);
  readonly eventThrottleRate = input<number | null>(null);
  readonly isAcceptingEvents = input<boolean | null>(null);
  readonly hideActions = input(false);
  readonly variant = input<"upgrade" | "get-started">("upgrade");
  readonly nextPlanEvents = input<number | null>(null);
  readonly freeEventLimit = input<number | null>(null);
  readonly upgradeLoading = input(false);
  /**
   * The org already pays for a plan. Checkout creates a subscription, so it
   * is the free org's path only, and the billing portal cannot change the
   * plan of a subscription that has ever carried the metered on-demand item,
   * which this page cannot see. Until plan changes move in-app, a paid org is
   * offered a conversation: no named upgrade, no pricing dialog.
   */
  readonly paid = input(false);
  /**
   * Whether the plan list has arrived. Without it `nextPlanEvents === null`
   * cannot tell "still loading" from "nothing bigger exists", and a mid-size
   * org would flash the largest-plan copy on every page load.
   */
  readonly plansLoaded = input(false);
  /**
   * The shared throttle diagnosis, from the same state machine the overage
   * card and snackbar branch on. The banner's copy names a remedy, so it has
   * to come from the state that knows which remedy is real; reading the raw
   * rate had this banner selling upgrades while the card below said to wait.
   */
  readonly throttleState = input<OverageThrottleState>("unknown");
  /**
   * The throttle diagnosis could not be fetched, as distinct from not having
   * arrived yet. The rate comes from the organization payload, so a throttled
   * org stays visible on the plain pitch instead of going quiet about events
   * we know are being dropped.
   */
  readonly throttleStateUnavailable = input(false);
  /**
   * The cap and the on-demand toggle are owner-only, so "cap" and
   * "no-overage" point everyone else at an owner, as the snackbar does.
   */
  readonly canManage = input(true);
  /** Where a customer with nothing left to upgrade to should write. */
  readonly contactEmail = input<string | null>(null);

  readonly upgradeClick = output<void>();
  readonly comparePlansClick = output<void>();

  readonly nextPlanLabel = computed(() =>
    this.formatEvents(this.nextPlanEvents()),
  );
  readonly freeEventLabel = computed(() =>
    this.formatEvents(this.freeEventLimit()),
  );
  /**
   * Nothing to upgrade to: the products have not loaded yet, or the org is
   * already on the largest plan. Both leave the upgrade action with no plan to
   * name and no price to dispatch, so the button is hidden rather than shown
   * with an empty label and a click that does nothing.
   */
  readonly hasNextPlan = computed(() => this.nextPlanEvents() !== null);
  /**
   * On the largest plan we sell: the plans are in and none is bigger. Upgrading
   * is not a remedy we can offer, so the copy has to name the controls that do
   * work (the overage card below) instead of an action with no button.
   */
  readonly isLargestPlan = computed(
    () => this.plansLoaded() && this.nextPlanEvents() === null,
  );
  /**
   * Event collection switched off for this org by hand. Nothing the customer
   * can buy lifts it, so this outranks every other message: the ingest path
   * refuses events on this flag alone, independently of the throttle ramp.
   */
  readonly isSuspended = computed(() => this.isAcceptingEvents() === false);
  /**
   * The quota ramp has reached a total block. Read from the throttle rate
   * rather than `isAcceptingEvents`, which is a separate manual switch that
   * upgrading does not clear; ingest tests the two independently.
   */
  readonly isHardStopped = computed(() => this.eventThrottleRate() === 100);
  readonly isThrottling = computed(() => {
    const rate = this.eventThrottleRate();
    return rate !== null && rate > 0;
  });
  /**
   * Throttled with a remedy this banner can honestly name. "throttled" is
   * excluded because it is a lag the server clears on its own; the card below
   * says so, and any remedy sold here would contradict it. "unknown" and
   * "none" are excluded because the status either has not arrived or already
   * reads clear, and copy chosen without it can name the wrong remedy.
   */
  readonly actionableThrottle = computed(() => {
    const state = this.throttleState();
    return (
      state === "cap" ||
      state === "no-overage" ||
      state === "unavailable" ||
      state === "stalled-plan" ||
      state === "stalled-broken"
    );
  });
  /**
   * A throttled org whose diagnosis offers nothing to sell or explain here
   * gets no banner at all rather than a hedge: the overage card directly
   * below owns the transient "taking effect" notice. A diagnosis that failed
   * to load is the exception, since the card hides itself on the same failure
   * and silence would be the only thing a throttled org saw.
   */
  readonly visible = computed(() => {
    if (this.variant() === "get-started") return true;
    if (this.isSuspended()) return true;
    if (this.isThrottling())
      return this.actionableThrottle() || this.throttleStateUnavailable();
    return true;
  });
  /**
   * States with no self-serve plan change, so the action is a conversation:
   * nothing bigger to sell, a paused org, an on-demand stall only we can fix,
   * or a paid org (see `paid`).
   */
  readonly contactInstead = computed(
    () =>
      this.paid() ||
      this.isSuspended() ||
      this.isLargestPlan() ||
      this.throttleState() === "stalled-broken",
  );
  /** The free org's named upgrade, which goes through Checkout. */
  readonly showUpgrade = computed(
    () =>
      !this.paid() &&
      this.hasNextPlan() &&
      !this.isSuspended() &&
      this.throttleState() !== "stalled-broken",
  );

  onUpgrade() {
    this.upgradeClick.emit();
  }

  onComparePlans() {
    this.comparePlansClick.emit();
  }

  private formatEvents(count: number | null): string {
    if (count === null) return "";
    if (count >= 1_000_000) return `${count / 1_000_000}M`;
    if (count >= 1_000) return `${count / 1_000}k`;
    return count.toLocaleString();
  }
}

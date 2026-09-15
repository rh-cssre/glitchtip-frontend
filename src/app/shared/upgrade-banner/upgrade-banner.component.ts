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
   * Whether the plan list has arrived. Without it `nextPlanEvents === null`
   * cannot tell "still loading" from "nothing bigger exists", and a mid-size
   * org would flash the largest-plan copy on every page load.
   */
  readonly plansLoaded = input(false);
  /**
   * Whether raising the overage spend cap is the live remedy, i.e. overage is
   * already on. Decides which of the two controls the largest-plan copy points
   * at; the overage card that owns both sits directly below this banner.
   */
  readonly overageEnabled = input(false);
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

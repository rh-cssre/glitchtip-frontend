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

  readonly upgradeClick = output<void>();
  readonly comparePlansClick = output<void>();

  readonly nextPlanLabel = computed(() =>
    this.formatEvents(this.nextPlanEvents()),
  );
  readonly freeEventLabel = computed(() =>
    this.formatEvents(this.freeEventLimit()),
  );
  readonly isHardStopped = computed(() => this.isAcceptingEvents() === false);
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

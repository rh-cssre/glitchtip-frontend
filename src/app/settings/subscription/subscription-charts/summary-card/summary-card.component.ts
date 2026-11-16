import { Component, ChangeDetectionStrategy, input, computed } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "gt-summary-card",
  imports: [DecimalPipe, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: "./summary-card.component.html",
  styleUrls: ["./summary-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  title = input.required<string>();
  value = input.required<number | null>();
  eventsAllowed = input.required<number | null>();
  limitThreshold = input(80);
  loading = input(false);
  showLimits = input(true);

  percent = computed(() => {
    const value = this.value();
    const allowed = this.eventsAllowed();
    if (!this.showLimits() || value == null || !allowed) return 0;
    return Math.round((value / allowed) * 100);
  });

  isOverLimit = computed(() => this.percent() >= this.limitThreshold());

  subtitle = computed(() => {
    const value = this.value();
    if (value === null) return $localize`Not enough data`;
    if (!this.showLimits()) return "";
    const percent = this.percent();
    if (percent >= 100 && this.limitThreshold() === 100)
      return $localize`Over limit`;
    return `${percent}% of limit (${this.eventsAllowed()})`;
  });
}

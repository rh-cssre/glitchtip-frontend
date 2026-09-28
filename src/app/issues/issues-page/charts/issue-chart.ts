import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from "@angular/core";
import { DatePipe, I18nPluralPipe } from "@angular/common";
import { BarVerticalComponent } from "@glitchtip/ng-charts";
import {
  FormattedStatsDataPoint,
  StatsDataPointBase,
  StatsPeriod,
} from "../../interfaces";

const HIGH_THRESHOLD_RATIO = 0.8;

@Component({
  selector: "gt-issue-chart",
  standalone: true,
  imports: [DatePipe, I18nPluralPipe, BarVerticalComponent],
  templateUrl: "./issue-chart.html",
  styleUrl: "./issue-chart.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueChart {
  formattedStats = input.required<FormattedStatsDataPoint[]>();
  statsChartDataFrame = input.required<StatsDataPointBase[]>();
  statsPeriod = input.required<StatsPeriod>();
  serverTimeZone = input.required<string | undefined>();
  loading = input.required<boolean>();

  customColors = computed(() => {
    const data = this.formattedStats();
    const max = Math.max(...data.map((d) => d.value), 0);
    const threshold = max * HIGH_THRESHOLD_RATIO;

    return data
      .filter((d) => d.value > 0)
      .map((d) => ({
        name: d.name,
        value:
          d.value >= threshold
            ? "var(--mat-sys-error)"
            : "var(--mat-sys-secondary)",
      }));
  });
}

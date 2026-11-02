import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  input,
  LOCALE_ID,
  signal,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { BarVerticalStackedComponent } from "@glitchtip/ng-charts";
import { MatCardModule } from "@angular/material/card";
import { components } from "src/app/api/api-schema";

type DailyEventEntry = components["schemas"]["DailyEventCountEntry"];

@Component({
  selector: "gt-daily-events-chart",
  imports: [DecimalPipe, BarVerticalStackedComponent, MatCardModule],
  templateUrl: "./daily-events-chart.component.html",
  styleUrls: ["./daily-events-chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyEventsChartComponent implements OnDestroy {
  private readonly locale = inject(LOCALE_ID);
  private readonly series = {
    performance: $localize`Performance`,
    issues: $localize`Issues`,
    uptime: $localize`Uptime`,
    logs: $localize`Logs`,
    projected: $localize`Projected`,
  };
  private resizeObserver?: ResizeObserver;
  private _containerRef?: ElementRef<HTMLDivElement>;

  readonly dailyEvents = input<DailyEventEntry[]>([]);
  readonly periodEnd = input<string | null>(null);
  readonly predictedTotal = input<number | null>(null);

  view = signal<[number, number]>([600, 200]);

  customColors = [
    { name: this.series.performance, value: "var(--mat-sys-primary)" },
    { name: this.series.issues, value: "var(--issues-color)" },
    { name: this.series.uptime, value: "var(--uptime-color)" },
    { name: this.series.logs, value: "var(--logs-color)" },
    { name: this.series.projected, value: "var(--mat-sys-surface-container-high)" },
  ];

  chartData = computed(() => {
    const events = this.dailyEvents();
    const endDate = this.periodEnd();
    const predicted = this.predictedTotal();

    const series: { name: string; series: { name: string; value: number }[] }[] = [];

    for (const entry of events) {
      series.push({
        name: entry.date,
        series: [
          { name: this.series.performance, value: entry.transactionEventCount },
          { name: this.series.issues, value: entry.eventCount },
          { name: this.series.uptime, value: entry.uptimeCheckEventCount },
          { name: this.series.logs, value: entry.logEventCount },
        ],
      });
    }

    if (endDate && predicted !== null && events.length > 0) {
      // API returns billed-event units (uptime/logs weighted 0.1 server-side),
      // so the actual billed total is a plain sum.
      const totalActual = events.reduce(
        (sum, e) =>
          sum +
          e.eventCount +
          e.transactionEventCount +
          e.uptimeCheckEventCount +
          e.logEventCount,
        0,
      );
      const remaining = Math.max(0, predicted - totalActual);
      const lastDate = new Date(events[events.length - 1].date);
      const end = new Date(endDate);
      const futureDays = Math.max(
        1,
        Math.ceil((end.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)),
      );
      const dailyProjected = Math.round(remaining / futureDays);

      for (let i = 1; i <= futureDays; i++) {
        const futureDate = new Date(lastDate);
        futureDate.setDate(futureDate.getDate() + i);
        if (futureDate > end) break;
        const dateStr = futureDate.toISOString().split("T")[0];
        series.push({
          name: dateStr,
          series: [
            { name: this.series.projected, value: dailyProjected },
          ],
        });
      }
    }

    return series;
  });

  xAxisTickFormatting = (dateStr: string): string => {
    const d = new Date(dateStr + "T00:00:00");
    const day = d.getDate();
    // Show label on 1st, and every 3rd day
    if (day === 1 || day % 3 === 0) {
      return new Intl.DateTimeFormat(this.locale, { month: "short", day: "numeric" }).format(d);
    }
    return "";
  };

  @ViewChild("containerRef")
  set containerRef(element: ElementRef<HTMLDivElement> | undefined) {
    if (element) {
      this._containerRef = element;
      this.initializeResizeObserver();
    } else if (this._containerRef) {
      this.resizeObserver?.disconnect();
      this._containerRef = undefined;
    }
  }

  private initializeResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      this.view.set([width, 200]);
    });
    if (this._containerRef) {
      this.resizeObserver.observe(this._containerRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

}

import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";
import { DailyEventsChartComponent } from "./daily-events-chart/daily-events-chart.component";
import { SummaryCardComponent } from "./summary-card/summary-card.component";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";

@Component({
  selector: "gt-subscription-charts",
  imports: [
    DecimalPipe,
    MatCardModule,
    MatProgressSpinnerModule,
    DailyEventsChartComponent,
    SummaryCardComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./subscription-charts.component.html",
  styleUrls: ["./subscription-charts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionChartsComponent {
  private subscriptionService = inject(SubscriptionService);
  private dialog = inject(MatDialog);

  openEventInfo() {
    this.dialog.open(EventInfoComponent);
  }

  totalEventsAllowed = input.required<number | null>();
  showLimits = input(true);

  eventsCountCurrentPeriod = this.subscriptionService.eventsCountCurrentPeriod;
  previousPeriod = this.subscriptionService.eventsCountPreviousPeriod;
  predictedTotal = this.subscriptionService.predictedEndOfMonth;
  subscription = this.subscriptionService.subscription;
  dailyEvents = this.subscriptionService.dailyEvents;

  periodEnd = computed(() => {
    const sub = this.subscription();
    return sub?.subscriptionCycleEnd ?? sub?.currentPeriodEnd ?? null;
  });

  currentPeriodLoading = this.subscriptionService.currentPeriodLoading;
  previousPeriodLoading = this.subscriptionService.previousPeriodLoading;

  previousPeriodTotal = computed(() => {
    const prev = this.previousPeriod();
    if (!prev) return null;
    return (
      prev.total ??
      prev.eventCount +
        prev.transactionEventCount +
        prev.uptimeCheckEventCount +
        (prev.logEventCount ?? 0) * 0.1
    );
  });

  eventBreakdown = computed(() => {
    const events = this.eventsCountCurrentPeriod();
    if (!events) return null;
    const total = events.total || 1;
    return {
      performance: {
        count: events.transactionEventCount ?? 0,
        percent: Math.round(
          ((events.transactionEventCount ?? 0) / total) * 100,
        ),
      },
      issues: {
        count: events.eventCount ?? 0,
        percent: Math.round(((events.eventCount ?? 0) / total) * 100),
      },
      uptime: {
        count: events.uptimeCheckEventCount ?? 0,
        percent: Math.round(
          ((events.uptimeCheckEventCount ?? 0) / total) * 100,
        ),
      },
      logs: {
        count: events.logEventCount ?? 0,
        percent: Math.round(((events.logEventCount ?? 0) / total) * 100),
      },
      fileSizeMb: events.fileSizeMb ?? 0,
    };
  });
}

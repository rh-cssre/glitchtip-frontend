import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { PercentPipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule, Sort } from "@angular/material/sort";

import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { TransactionGroupDetailService } from "./transaction-group-detail-state";
import { HumanizeDurationPipe } from "../../shared/seconds-or-ms.pipe";
import { OrganizationsService } from "src/app/api/organizations.service";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";

type SpanSortKey = "totalTime" | "avgDuration" | "p95Duration" | "count";

@Component({
  selector: "gt-transaction-group-detail",
  templateUrl: "./transaction-group-detail.html",
  styleUrls: ["./transaction-group-detail.scss"],
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    MatIconModule,
    PercentPipe,
    TopAppBar,
    BackLinkComponent,
    HumanizeDurationPipe,
    DetailHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [TransactionGroupDetailService],
})
export class TransactionGroupDetail implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private transactionGroupDetailService = inject(TransactionGroupDetailService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  id = input.required<number>({ alias: "transaction-group-id" });
  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  organization = this.organizationsService.activeOrganization;
  initialLoadComplete = this.transactionGroupDetailService.initialLoadComplete;
  transactionGroup = this.transactionGroupDetailService.transactionGroup;
  spansLoading = this.transactionGroupDetailService.spansLoading;

  spanColumns = [
    "op",
    "description",
    "count",
    "avgDuration",
    "p95Duration",
    "totalTime",
    "pctTime",
  ];

  selectedOp = signal<string | null>(null);

  #sort = signal<{ active: SpanSortKey; direction: "asc" | "desc" }>({
    active: "totalTime",
    direction: "desc",
  });

  sortedSpans = computed(() => {
    const spans = this.transactionGroupDetailService.spans();
    if (!spans) return spans;
    const { active, direction } = this.#sort();
    const mult = direction === "asc" ? 1 : -1;
    return [...spans].sort((a, b) => (a[active] - b[active]) * mult);
  });

  totalSpanTime = computed(() => {
    const spans = this.transactionGroupDetailService.spans();
    if (!spans) return 0;
    return spans.reduce((sum, s) => sum + s.totalTime, 0);
  });

  opSummary = computed(() => {
    const spans = this.transactionGroupDetailService.spans();
    const total = this.totalSpanTime();
    if (!spans || total === 0) return [];
    const merged = new Map<string, { totalTime: number; count: number }>();
    for (const s of spans) {
      const existing = merged.get(s.op);
      if (existing) {
        existing.totalTime += s.totalTime;
        existing.count += s.count;
      } else {
        merged.set(s.op, { totalTime: s.totalTime, count: s.count });
      }
    }
    const sorted = Array.from(merged.entries()).sort(
      (a, b) => b[1].totalTime - a[1].totalTime,
    );
    const maxVisible = 5;
    const top = sorted.slice(0, maxVisible);
    const rest = sorted.slice(maxVisible);

    const result = top.map(([op, data]) => ({
      op,
      totalTime: data.totalTime,
      pct: data.totalTime / total,
      isOther: false,
    }));

    if (rest.length > 0) {
      const otherTime = rest.reduce((sum, [, data]) => sum + data.totalTime, 0);
      result.push({
        op: `Other (${rest.length})`,
        totalTime: otherTime,
        pct: otherTime / total,
        isOther: true,
      });
    }

    return result;
  });

  filteredSpans = computed(() => {
    const spans = this.sortedSpans();
    const selected = this.selectedOp();
    if (!spans || !selected) return spans;
    return spans.filter((s) => s.op === selected);
  });

  toggleOpFilter(op: string, isOther: boolean) {
    if (isOther) return;
    this.selectedOp.set(this.selectedOp() === op ? null : op);
  }

  pctOfTotal(totalTime: number): number {
    const total = this.totalSpanTime();
    return total > 0 ? totalTime / total : 0;
  }

  ngOnInit() {
    this.transactionGroupDetailService.setParams(this.orgSlug(), this.id());
  }

  onSortChange(event: Sort) {
    if (!event.direction) {
      this.#sort.set({ active: "totalTime", direction: "desc" });
      return;
    }
    this.#sort.set({
      active: event.active as SpanSortKey,
      direction: event.direction,
    });
  }
}

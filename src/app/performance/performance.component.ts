import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Subscription } from "rxjs";
import { map, filter, distinctUntilChanged } from "rxjs/operators";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { PaginationBaseComponent } from "../shared/stateful-service/pagination-stateful-service";
import { PerformanceState, PerformanceService } from "./performance.service";

@Component({
  selector: "app-performance",
  templateUrl: "./performance.component.html",
  styleUrls: ["./performance.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnDestroy {
  displayedColumns = ["transaction", "time", "date", "daysAgo"];

  sub: Subscription | null = null;
  transactions$ = this.service.transactionsWithDelta$;

  countMapping: { [k: string]: string } = {
    "=1": "Transaction",
    other: "Transactions",
  };

  constructor(
    protected service: PerformanceService,
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute
  ) {
    super(service);
    this.sub = combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.route.queryParams,
    ])
      .pipe(
        map(([slug, queryParams]) => {
          const cursor: string | undefined = queryParams.cursor;
          return { slug, cursor };
        }),
        filter(({ slug, cursor }) => !!slug),
        distinctUntilChanged()
      )
      .subscribe(({ slug, cursor }) => {
        this.service.getTransactions(slug!, cursor);
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.service.clearState();
  }
}

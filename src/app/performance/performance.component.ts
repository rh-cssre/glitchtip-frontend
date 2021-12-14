import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { PaginationBaseComponent } from "../shared/stateful-service/pagination-base.component";
import { PerformanceState, PerformanceService } from "./performance.service";

@Component({
  selector: "gt-performance",
  templateUrl: "./performance.component.html",
  styleUrls: ["./performance.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnDestroy
{
  displayedColumns = ["transaction", "time", "date", "daysAgo"];

  sub: Subscription | null = null;
  transactions$ = this.service.transactionsWithDelta$;

  countMapping: { [k: string]: string } = {
    "=1": "Transaction",
    other: "Transactions",
  };

  constructor(
    protected service: PerformanceService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, router, route);
    this.sub = this.cursorNavigationEnd$
      .pipe(
        withLatestFrom(this.route.params),
        map(([cursor, params]) => {
          const slug: string | undefined = params["org-slug"];
          return { slug, cursor };
        })
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

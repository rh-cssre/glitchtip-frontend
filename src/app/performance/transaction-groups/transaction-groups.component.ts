import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { withLatestFrom, Subscription, lastValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { PerformanceService, PerformanceState } from "../performance.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.component.html",
  styleUrls: ["./transaction-groups.component.scss"],
})
export class TransactionGroupsComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnInit
{
  sortForm = new FormGroup({
    sort: new FormControl({
      value: "",
      disabled: true,
    }),
  });
  dateForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  sorts = {
    "-avg_duration": "Feastest",
    avg_duration: "Slowest",
    "-created": "Newest Creation Date",
    created: "Oldest Creation Date",
    "-transaction_count": "Most Frequent",
    transaction_count: "Least Frequent",
  };

  routerEventSubscription: Subscription;
  transactionGroups$ = this.performanceService.transactionGroups$;
  navigationEnd$ = this.cursorNavigationEnd$.pipe(
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([_, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const cursor: string | undefined = queryParams.cursor;
      let project: string[] | null = null;
      if (typeof queryParams.project === "string") {
        project = [queryParams.project];
      } else if (typeof queryParams.project === "object") {
        project = queryParams.project;
      }
      const start: string | undefined = queryParams.start;
      const end: string | undefined = queryParams.end;
      const sort: string | undefined = queryParams.sort;
      return { orgSlug, cursor, project, start, end, sort };
    })
  );

  constructor(
    private performanceService: PerformanceService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(performanceService, router, route);

    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, cursor, project, start, end, sort }) => {
        if (orgSlug) {
          this.performanceService.getTransactionGroups(
            orgSlug,
            cursor,
            project,
            start,
            end,
            sort
          );
        }
      }
    );
  }

  ngOnInit() {
    lastValueFrom(this.transactionGroups$.pipe(tap((groups) => console.log(groups))))
  }
}

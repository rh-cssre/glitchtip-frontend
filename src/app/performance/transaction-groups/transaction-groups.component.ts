import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { withLatestFrom, Subscription, lastValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { PerformanceService, PerformanceState } from "../performance.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { checkForOverflow, normalizeProjectParams } from "src/app/shared/shared.utils";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.component.html",
  styleUrls: ["./transaction-groups.component.scss"],
})
export class TransactionGroupsComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnInit
{
  displayedColumns = ["name-and-project", "avgDuration"]
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
  tooltipDisabled = false
  transactionCountPluralMapping: { [k: string]: string } = {
    "=1": "1 Transaction",
    other: "# Transactions",
  };

  routerEventSubscription: Subscription;
  transactionGroupsDisplay$ = this.performanceService.transactionGroupsDisplay$;
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

  projectsFromParams$ = this.route.queryParams.pipe(
    map((params) => normalizeProjectParams(params.project))
  );

  appliedProjectCount$ = this.projectsFromParams$.pipe(
    map((projects) => {
      if (Array.isArray(projects)) {
        return projects.length;
      }
      return 0;
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

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }

  ngOnInit() {
    lastValueFrom(this.transactionGroupsDisplay$.pipe(tap((groups) => console.log(groups))))
  }
}

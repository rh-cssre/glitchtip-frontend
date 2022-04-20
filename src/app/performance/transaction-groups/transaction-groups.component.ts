import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { withLatestFrom, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { PerformanceService, PerformanceState } from "../performance.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import {
  checkForOverflow,
  normalizeProjectParams,
} from "src/app/shared/shared.utils";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.component.html",
  styleUrls: ["./transaction-groups.component.scss"],
})
export class TransactionGroupsComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnInit
{
  displayedColumns = ["name-and-project", "avgDuration"];
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
  environmentForm = new FormGroup({
    environment: new FormControl({ value: "" }),
  });
  searchForm = new FormGroup({
    query: new FormControl(""),
  });

  sorts = [
    { param: "-avg_duration", display: "Slowest" },
    { param: "avg_duration", display: "Fastest" },
    { param: "-created", display: "Newest Creation Date" },
    { param: "created", display: "Oldest Creation Date" },
    { param: "-transaction_count", display: "Most Frequent" },
    { param: "transaction_count", display: "Least Frequent" },
  ];
  tooltipDisabled = false;
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
      const environment: string | undefined = queryParams.environment;
      const query: string | undefined = queryParams.query;
      return { orgSlug, cursor, project, start, end, sort, environment, query };
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
      ({ orgSlug, cursor, project, start, end, sort, environment, query }) => {
        if (orgSlug) {
          this.performanceService.getTransactionGroups(
            orgSlug,
            cursor,
            project,
            start,
            end,
            sort,
            environment,
            query
          );
        }
      }
    );

    this.transactionGroupsDisplay$.subscribe((groups) =>
      groups.length === 0
        ? this.sortForm.controls.sort.disable()
        : this.sortForm.controls.sort.enable()
    );
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }

  ngOnInit() {
    this.route.params.subscribe((_) => {
      const start: string | undefined = this.route.snapshot.queryParams.start;
      const end: string | undefined = this.route.snapshot.queryParams.end;
      const sort: string | undefined = this.route.snapshot.queryParams.sort;
      this.sortForm.setValue({
        sort: sort !== undefined ? sort : "created",
      });
      this.dateForm.setValue({
        startDate: start ? start : null,
        endDate: end ? end : null,
      });
    });
  }

  onDateFormSubmit(queryParams: object) {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });
  }

  dateFormReset() {
    this.router.navigate([], {
      queryParams: {
        cursor: null,
        start: null,
        end: null,
      },
      queryParamsHandling: "merge",
    });
    this.dateForm.setValue({ startDate: null, endDate: null });
  }

  sortByChanged(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { cursor: null, sort: event.value },
      queryParamsHandling: "merge",
    });
  }

  filterByEnvironment(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { cursor: null, environment: event.value },
      queryParamsHandling: "merge",
    });
  }

  searchSubmit() {
    this.router.navigate([], {
      queryParams: {
        query: this.searchForm.value.query,
        cursor: null,
      },
      queryParamsHandling: "merge",
    });
  }
}

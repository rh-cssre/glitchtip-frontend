import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { combineLatest, withLatestFrom, Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { PerformanceService, PerformanceState } from "../performance.service";
import { ProjectEnvironmentsService } from "src/app/settings/projects/project-detail/project-environments/project-environments.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { normalizeProjectParams } from "src/app/shared/shared.utils";
import { TransactionGroup } from "src/app/api/transactions/transactions.interfaces";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.component.html",
  styleUrls: ["./transaction-groups.component.scss"],
})
export class TransactionGroupsComponent
  extends PaginationBaseComponent<PerformanceState, PerformanceService>
  implements OnInit, OnDestroy
{
  displayedColumns = ["name-and-project", "avgDuration"];
  sortForm = new UntypedFormGroup({
    sort: new UntypedFormControl({
      value: "",
      disabled: true,
    }),
  });
  dateForm = new UntypedFormGroup({
    startDate: new UntypedFormControl(""),
    endDate: new UntypedFormControl(""),
  });
  environmentForm = new UntypedFormGroup({
    environment: new UntypedFormControl({ value: "" }),
  });
  searchForm = new UntypedFormGroup({
    query: new UntypedFormControl(""),
  });

  sorts = [
    { param: "-avg_duration", display: "Slowest" },
    { param: "avg_duration", display: "Fastest" },
    { param: "-transaction_count", display: "Most Frequent" },
    { param: "transaction_count", display: "Least Frequent" },
  ];
  tooltipDisabled = false;
  transactionCountPluralMapping: { [k: string]: string } = {
    "=1": "1 Transaction",
    other: "# Transactions",
  };

  orgEnvironmentSubscription: Subscription;
  projectEnvironmentSubscription: Subscription;
  resetEnvironmentSubscription: Subscription;
  routerEventSubscription: Subscription;
  transactionGroupsDisplaySubscription: Subscription;
  transactionGroupsDisplay$ = this.performanceService.transactionGroupsDisplay$;
  errors$ = this.performanceService.errors$;
  loading$ = this.performanceService.loading$;
  initialLoadComplete$ = this.performanceService.initialLoadComplete$;
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
  activeOrganizationProjects$ =
    this.organizationsService.activeOrganizationProjects$;

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

  organizationEnvironments$ = combineLatest([
    this.appliedProjectCount$,
    this.organizationsService.organizationEnvironmentsProcessed$,
    this.projectEnvironmentsService.visibleEnvironments$,
  ]).pipe(
    map(([appliedProjectCount, orgEnvironments, projectEnvironments]) =>
      appliedProjectCount !== 1 ? orgEnvironments : projectEnvironments
    )
  );

  constructor(
    private organizationsService: OrganizationsService,
    private performanceService: PerformanceService,
    private projectEnvironmentsService: ProjectEnvironmentsService,
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

    this.organizationEnvironments$.subscribe((environments) =>
      environments.length === 0
        ? this.environmentForm.controls.environment.disable()
        : this.environmentForm.controls.environment.enable()
    );

    this.transactionGroupsDisplaySubscription =
      this.transactionGroupsDisplay$.subscribe((groups) =>
        groups.length === 0
          ? this.sortForm.controls.sort.disable()
          : this.sortForm.controls.sort.enable()
      );

    this.orgEnvironmentSubscription = this.organizationsService
      .observeOrgEnvironments(this.navigationEnd$)
      .subscribe();

    this.projectEnvironmentSubscription = this.projectEnvironmentsService
      .observeProjectEnvironments(this.navigationEnd$)
      .subscribe();

    this.resetEnvironmentSubscription = combineLatest([
      this.projectEnvironmentsService.visibleEnvironmentsLoaded$,
      this.route.queryParams,
    ])
      .pipe(
        tap(([projectEnvironments, queryParams]) => {
          if (
            queryParams.project &&
            queryParams.environment &&
            !projectEnvironments.includes(queryParams.environment)
          ) {
            this.environmentForm.setValue({ environment: null });
            this.router.navigate([], {
              queryParams: { environment: null },
              queryParamsHandling: "merge",
            });
          }
        })
      )
      .subscribe();
  }

  checkForOverflow($event: Event) {
    const target = $event.target as HTMLElement;
    if (target.parentElement) {
      const maxWidth = target.closest("div")!.offsetWidth;
      const spans = target.parentElement.children;
      let totalWidth = 0;
      for (let i = 0; i < spans.length; i++) {
        if (spans[i] instanceof HTMLElement) {
          const span1 = spans[i] as HTMLElement;
          totalWidth += span1.offsetWidth;
        }
      }
      return totalWidth > maxWidth ? false : true;
    }
    return true;
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = this.checkForOverflow($event);
  }

  setTitleTooltip(group: TransactionGroup) {
    if (group.method) {
      return `${group.method} ${group.transaction}`;
    } else {
      return `${group.transaction} ${group.op}`;
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((_) => {
      const start: string | undefined = this.route.snapshot.queryParams.start;
      const end: string | undefined = this.route.snapshot.queryParams.end;
      const sort: string | undefined = this.route.snapshot.queryParams.sort;
      const query: string | undefined = this.route.snapshot.queryParams.query;
      this.sortForm.setValue({
        sort: sort !== undefined ? sort : "-avg_duration",
      });
      this.dateForm.setValue({
        startDate: start ? new Date(start.replace("Z", "")) : null,
        endDate: end ? new Date(end.replace("Z", "")) : null,
      });
      this.searchForm.setValue({
        query: query !== undefined ? query : "",
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

  ngOnDestroy() {
    this.orgEnvironmentSubscription.unsubscribe();
    this.projectEnvironmentSubscription.unsubscribe();
    this.resetEnvironmentSubscription.unsubscribe();
    this.routerEventSubscription.unsubscribe();
    this.transactionGroupsDisplaySubscription.unsubscribe();
    this.performanceService.clearState();
    this.projectEnvironmentsService.clearState();
  }
}

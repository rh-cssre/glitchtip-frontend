import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { combineLatest, EMPTY } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { PerformanceService } from "../performance.service";
import { ProjectEnvironmentsService } from "src/app/settings/projects/project-detail/project-environments/project-environments.service";
import { normalizeProjectParams } from "src/app/shared/shared.utils";
import { TransactionGroup } from "src/app/api/transactions/transactions.interfaces";
import { HumanizeDurationPipe } from "../../shared/seconds-or-ms.pipe";
import { ListFooterComponent } from "../../list-elements/list-footer/list-footer.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DataFilterBarComponent } from "../../list-elements/data-filter-bar/data-filter-bar.component";
import { MatTableModule } from "@angular/material/table";
import { ProjectFilterBarComponent } from "../../list-elements/project-filter-bar/project-filter-bar.component";
import { ListTitleComponent } from "../../list-elements/list-title/list-title.component";

@Component({
  selector: "gt-transaction-groups",
  templateUrl: "./transaction-groups.component.html",
  styleUrls: ["./transaction-groups.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ListTitleComponent,
    ProjectFilterBarComponent,
    MatTableModule,
    DataFilterBarComponent,
    MatTooltipModule,
    RouterLink,
    ListFooterComponent,
    HumanizeDurationPipe,
  ],
})
export class TransactionGroupsComponent implements OnInit, OnDestroy {
  paginator$ = this.service.paginator$;
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
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
    environment: new FormControl({ value: "", disabled: true }),
  });
  searchForm = new FormGroup({
    query: new FormControl(""),
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

  transactionGroupsDisplay$ = this.service.transactionGroupsDisplay$;
  errors$ = this.service.errors$;
  loading$ = this.service.loading$;
  initialLoadComplete$ = this.service.initialLoadComplete$;
  activeOrganizationProjects$ =
    this.organizationsService.activeOrganizationProjects$;

  projectsFromParams$ = this.route.queryParams.pipe(
    map((params) => normalizeProjectParams(params.project)),
  );

  appliedProjectCount$ = this.projectsFromParams$.pipe(
    map((projects) => {
      if (Array.isArray(projects)) {
        return projects.length;
      }
      return 0;
    }),
  );

  organizationEnvironments$ = combineLatest([
    this.appliedProjectCount$,
    this.organizationsService.organizationEnvironmentsProcessed$,
    this.projectEnvironmentsService.visibleEnvironments$,
  ]).pipe(
    map(([appliedProjectCount, orgEnvironments, projectEnvironments]) =>
      appliedProjectCount !== 1 ? orgEnvironments : projectEnvironments,
    ),
  );

  constructor(
    private organizationsService: OrganizationsService,
    protected service: PerformanceService,
    private projectEnvironmentsService: ProjectEnvironmentsService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
    combineLatest([this.orgSlug$, this.route.queryParamMap])
      .pipe(
        switchMap(([orgSlug, params]) => {
          if (orgSlug) {
            const project = normalizeProjectParams(params.getAll("project"));
            return this.service.getTransactionGroups(
              orgSlug,
              params.get("cursor"),
              project,
              params.get("start"),
              params.get("end"),
              params.get("sort"),
              params.get("environment"),
              params.get("query"),
            );
          }
          return EMPTY;
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

    this.organizationEnvironments$.subscribe((environments) =>
      environments.length === 0
        ? this.environmentForm.controls.environment.disable()
        : this.environmentForm.controls.environment.enable(),
    );

    this.transactionGroupsDisplay$
      .pipe(takeUntilDestroyed())
      .subscribe((groups) =>
        groups.length === 0
          ? this.sortForm.controls.sort.disable()
          : this.sortForm.controls.sort.enable(),
      );

    this.orgSlug$
      .pipe(
        switchMap((orgSlug) => {
          if (orgSlug) {
            return this.organizationsService.getOrganizationEnvironments(
              orgSlug,
            );
          }
          return EMPTY;
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

    combineLatest([
      this.orgSlug$,
      this.route.queryParamMap.pipe(
        map((params) => params.getAll("project")[0]),
        filter((project) => !!project),
        distinctUntilChanged(),
      ),
      this.organizationsService.activeOrganizationProjects$,
    ]).pipe(
      switchMap(([orgSlug, projectId, orgProjects]) => {
        const projectSlug = orgProjects?.find(
          (orgProject) => orgProject.id.toString() === projectId,
        )?.slug;
        if (orgSlug && projectSlug) {
          return this.projectEnvironmentsService.retrieveEnvironmentsWithProperties(
            orgSlug,
            projectSlug,
          );
        }
        return EMPTY;
      }),
      takeUntilDestroyed(),
    );

    combineLatest([
      this.projectEnvironmentsService.visibleEnvironmentsLoaded$,
      this.route.queryParams,
    ])
      .pipe(
        takeUntilDestroyed(),
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
        }),
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
        startDate: (start ? new Date(start.replace("Z", "")) : null) as any,
        endDate: (end ? new Date(end.replace("Z", "")) : null) as any,
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
    this.projectEnvironmentsService.clearState();
    this.service.clearState();
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { combineLatest, EMPTY, lastValueFrom } from "rxjs";
import {
  map,
  filter,
  take,
  tap,
  switchMap,
  distinctUntilChanged,
} from "rxjs/operators";
import { IssuesService } from "../issues.service";
import { Issue, IssueStatus } from "../interfaces";
import { normalizeProjectParams } from "src/app/shared/shared.utils";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectEnvironmentsService } from "src/app/settings/projects/project-detail/project-environments/project-environments.service";
import { DaysAgoPipe, DaysOldPipe } from "../../shared/days-ago.pipe";
import { IssueZeroStatesComponent } from "../issue-zero-states/issue-zero-states.component";
import { ListFooterComponent } from "../../list-elements/list-footer/list-footer.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DataFilterBarComponent } from "../../list-elements/data-filter-bar/data-filter-bar.component";
import { MatTableModule } from "@angular/material/table";
import { ProjectFilterBarComponent } from "../../list-elements/project-filter-bar/project-filter-bar.component";
import { ListTitleComponent } from "../../list-elements/list-title/list-title.component";

@Component({
  selector: "gt-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ListTitleComponent,
    ProjectFilterBarComponent,
    MatTableModule,
    DataFilterBarComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ListFooterComponent,
    IssueZeroStatesComponent,
    DaysAgoPipe,
    DaysOldPipe,
  ],
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["select", "title", "events"];
  paginator$ = this.service.paginator$;
  loading$ = this.service.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  searchHits$ = this.service.searchHits$;
  searchDirectHit$ = this.service.searchDirectHit$;
  form = new FormGroup({
    query: new FormControl(""),
  });
  sortForm = new FormGroup({
    sort: new FormControl({
      value: "",
      disabled: true,
    }),
  });
  environmentForm = new FormGroup({
    environment: new FormControl(""),
  });
  dateForm = new FormGroup({
    startDate: new FormControl<Date | string>(""),
    endDate: new FormControl<Date | string>(""),
  });

  issues$ = this.service.issuesWithSelected$;
  areAllSelected$ = this.service.areAllSelected$;
  thereAreSelectedIssues$ = this.service.thereAreSelectedIssues$;
  allResultsSelected$ = this.service.allResultsSelected$;
  numberOfSelectedIssues$ = this.service.numberOfSelectedIssues$;
  activeOrganizationProjects$ =
    this.organizationsService.activeOrganizationProjects$;
  activeOrganization$ = this.organizationsService.activeOrganization$;
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
  errors$ = this.service.errors$;
  eventCountPluralMapping: { [k: string]: string } = {
    "=1": "1 event",
    other: "# events",
  };
  sorts = [
    { param: "-last_seen", display: "Last Seen" },
    { param: "last_seen", display: "First Seen" },
    { param: "-created", display: "Newest Creation Date" },
    { param: "created", display: "Oldest Creation Date" },
    { param: "-count", display: "Most Frequent" },
    { param: "count", display: "Least Frequent" },
    { param: "-priority", display: "Highest Priority" },
    { param: "priority", display: "Lowest Priority" },
  ];

  currentQueryParams$ = combineLatest([
    this.orgSlug$,
    this.route.queryParamMap,
  ]).pipe(
    map(([orgSlug, params]) => {
      let query = params.get("query");
      let project = normalizeProjectParams(params.getAll("project"));
      return {
        orgSlug,
        cursor: params.get("cursor"),
        query: typeof query === "string" ? query : undefined,
        project,
        start: params.get("start"),
        end: params.get("end"),
        sort: params.get("sort"),
        environment: params.get("environment"),
      };
    })
  );

  projectsFromParams$ = this.route.queryParams.pipe(
    map((params) => normalizeProjectParams(params.project))
  );

  /**
   * Corresponds to project picker/header nav/project IDs in the URL
   * If the count is zero, we show issues from all projects
   */
  appliedProjectCount$ = this.projectsFromParams$.pipe(
    map((projects) => {
      if (Array.isArray(projects)) {
        return projects.length;
      }
      return 0;
    })
  );

  showBulkSelectProject$ = combineLatest([
    this.areAllSelected$,
    this.numberOfSelectedIssues$,
    this.searchHits$,
  ]).pipe(
    map(([areAllSelected, numberOfSelectIssues, searchHits]) => {
      const hits = searchHits && numberOfSelectIssues < searchHits;
      if (areAllSelected && hits) {
        return true;
      } else {
        return false;
      }
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
    protected service: IssuesService,
    protected router: Router,
    protected route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private projectEnvironmentsService: ProjectEnvironmentsService
  ) {
    this.issues$.subscribe((resp) =>
      resp.length === 0
        ? this.sortForm.controls.sort.disable()
        : this.sortForm.controls.sort.enable()
    );

    this.organizationEnvironments$.subscribe((environments) =>
      environments.length === 0
        ? this.environmentForm.controls.environment.disable()
        : this.environmentForm.controls.environment.enable()
    );

    this.currentQueryParams$
      .pipe(
        switchMap((params) => {
          if (params.orgSlug) {
            return this.service.getIssues(
              params.orgSlug,
              params.cursor,
              params.query,
              params.project,
              params.start,
              params.end,
              params.sort,
              params.environment
            );
          }
          return EMPTY;
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.orgSlug$
      .pipe(
        switchMap((orgSlug) => {
          if (orgSlug) {
            return this.organizationsService.getOrganizationEnvironments(
              orgSlug
            );
          }
          return EMPTY;
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    combineLatest([
      this.orgSlug$,
      this.route.queryParamMap.pipe(
        map((params) => params.getAll("project")[0]),
        filter((project) => !!project),
        distinctUntilChanged()
      ),
      this.organizationsService.activeOrganizationProjects$,
    ])
      .pipe(
        switchMap(([orgSlug, projectId, orgProjects]) => {
          const projectSlug = orgProjects?.find(
            (orgProject) => orgProject.id.toString() === projectId
          )?.slug;
          if (orgSlug && projectSlug) {
            return this.projectEnvironmentsService.retrieveEnvironmentsWithProperties(
              orgSlug,
              projectSlug
            );
          }
          return EMPTY;
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    /**
     * When changing from one project to another, see if there is an environment
     * in the URL. If it doesn't match a project environment, reset the URL.
     */
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
        })
      )
      .subscribe();

    this.searchDirectHit$.pipe(takeUntilDestroyed()).subscribe((directHit) => {
      this.router.navigate(
        [directHit.id, "events", directHit.matchingEventId],
        {
          relativeTo: this.route,
          queryParams: { query: null },
          queryParamsHandling: "merge",
          replaceUrl: true, // so the browser back button works
        }
      );
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((_) => {
      const query: string | undefined = this.route.snapshot.queryParams.query;
      const start: string | undefined = this.route.snapshot.queryParams.start;
      const end: string | undefined = this.route.snapshot.queryParams.end;
      const sort: string | undefined = this.route.snapshot.queryParams.sort;
      const environment: string | undefined =
        this.route.snapshot.queryParams.environment;
      this.form.setValue({
        query: query !== undefined ? query : "is:unresolved",
      });
      this.sortForm.setValue({
        sort: sort !== undefined ? sort : "-last_seen",
      });
      this.environmentForm.setValue({
        environment: environment !== undefined ? environment : "",
      });
      this.dateForm.setValue({
        startDate: start ? new Date(start.replace("Z", "")) : null,
        endDate: end ? new Date(end.replace("Z", "")) : null,
      });
    });
  }

  ngOnDestroy() {
    this.projectEnvironmentsService.clearState();
    this.service.clearState();
  }

  trackIssues(index: number, issue: Issue): number {
    return issue.id;
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

  searchSubmit() {
    this.router.navigate([], {
      queryParams: {
        query: this.form.value.query,
        cursor: null,
      },
      queryParamsHandling: "merge",
    });
  }

  updateStatus(status: IssueStatus) {
    lastValueFrom(
      combineLatest([this.allResultsSelected$, this.currentQueryParams$]).pipe(
        take(1),
        tap(([allResultsSelected, params]) => {
          if (params.orgSlug) {
            if (allResultsSelected) {
              this.service.bulkUpdateStatus(
                status,
                params.orgSlug,
                params.project,
                params.query,
                params.start,
                params.end,
                params.environment
              );
            } else {
              this.service.updateStatusByIssueId(params.orgSlug, status);
            }
          }
        })
      )
    );
  }

  toggleCheck(issueId: number) {
    this.service.toggleSelectOne(issueId);
  }

  toggleSelectAllOnPage() {
    this.service.toggleSelectAllOnPage();
  }

  selectAllResults() {
    this.service.selectAllResults();
  }

  clearSelectAllResults() {
    this.service.cancelAllResultsSelection();
  }

  sortByChanged(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { cursor: null, sort: event.value },
      queryParamsHandling: "merge",
    });
  }

  filterByEnvironment(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { environment: event.value },
      queryParamsHandling: "merge",
    });
  }
}

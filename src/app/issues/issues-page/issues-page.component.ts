import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, combineLatest, EMPTY } from "rxjs";
import {
  map,
  filter,
  withLatestFrom,
  distinctUntilChanged,
  tap,
  mergeMap,
} from "rxjs/operators";
import { IssuesService, IssuesState } from "../issues.service";
import { normalizeProjectParams } from "../utils";
import { EnvironmentsService } from "src/app/api/environments/environments.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { ProjectEnvironmentsService } from "src/app/settings/projects/project-detail/project-environments/project-environments.service";

@Component({
  selector: "gt-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesPageComponent
  extends PaginationBaseComponent<IssuesState, IssuesService>
  implements OnInit, OnDestroy
{
  displayedColumns: string[] = ["select", "title", "events"];
  loading$ = this.issuesService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  searchHits$ = this.issuesService.searchHits$;
  searchDirectHit$ = this.issuesService.searchDirectHit$;
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
    environment: new FormControl({ value: "" }),
  });
  dateForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  issues$ = combineLatest([
    this.issuesService.issuesWithSelected$,
    this.loading$,
  ]).pipe(map(([issues, loading]) => (!loading ? issues : [])));
  areAllSelected$ = this.issuesService.areAllSelected$;
  thereAreSelectedIssues$ = this.issuesService.thereAreSelectedIssues$;
  selectedProjectInfo$ = this.issuesService.selectedProjectInfo$;
  numberOfSelectedIssues$ = this.issuesService.numberOfSelectedIssues$;
  activeOrganizationProjects$ =
    this.organizationsService.activeOrganizationProjects$;
  activeOrganization$ = this.organizationsService.activeOrganization$;
  navigationEnd$ = this.cursorNavigationEnd$.pipe(
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([cursor, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const query: string | undefined = queryParams.query;
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
      return { orgSlug, cursor, query, project, start, end, sort, environment };
    })
  );
  errors$ = this.issuesService.errors$;
  routerEventSubscription: Subscription;
  orgEnvironmentSubscription: Subscription;
  projectEnvironmentSubscription: Subscription;
  resetEnvironmentSubscription: Subscription;
  searchDirectHitSubscription: Subscription;
  eventCountPluralMapping: { [k: string]: string } = {
    "=1": "1 event",
    other: "# events",
  };
  sorts = {
    "-last_seen": "Last Seen",
    last_seen: "First Seen",
    "-created": "Newest Creation Date",
    created: "Oldest Creation Date",
    "-count": "Most Frequent",
    count: "Least Frequent",
    "-priority": "Highest Priority",
    priority: "Lowest Priority",
  };

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
    this.appliedProjectCount$,
    this.areAllSelected$,
    this.numberOfSelectedIssues$,
    this.searchHits$,
  ]).pipe(
    map(
      ([
        appliedProjectCount,
        areAllSelected,
        numberOfSelectIssues,
        searchHits,
      ]) => {
        const hits = searchHits && numberOfSelectIssues < searchHits;
        if (appliedProjectCount === 1 && areAllSelected && hits) {
          return true;
        } else {
          return false;
        }
      }
    )
  );

  organizationEnvironments$ = combineLatest([
    this.appliedProjectCount$,
    this.environmentsService.organizationEnvironmentsProcessed$,
    this.projectEnvironmentsService.visibleEnvironments$,
  ]).pipe(
    map(([appliedProjectCount, orgEnvironments, projectEnvironments]) =>
      appliedProjectCount !== 1 ? orgEnvironments : projectEnvironments
    )
  );

  constructor(
    private issuesService: IssuesService,
    protected router: Router,
    protected route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private environmentsService: EnvironmentsService,
    private projectEnvironmentsService: ProjectEnvironmentsService
  ) {
    super(issuesService, router, route);

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

    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, cursor, query, project, start, end, sort, environment }) => {
        if (orgSlug) {
          this.issuesService.getIssues(
            orgSlug,
            cursor,
            query,
            project,
            start,
            end,
            sort,
            environment
          );
        }
      }
    );

    this.orgEnvironmentSubscription = this.navigationEnd$
      .pipe(
        distinctUntilChanged((a, b) => a.orgSlug === b.orgSlug),
        mergeMap(({ orgSlug }) =>
          orgSlug
            ? this.environmentsService.getOrganizationEnvironments(orgSlug)
            : EMPTY
        )
      )
      .subscribe();

    this.projectEnvironmentSubscription = combineLatest([
      this.navigationEnd$,
      this.activeOrganizationProjects$,
    ])
      .pipe(
        filter(
          ([urlData, projects]) =>
            urlData.orgSlug !== undefined &&
            urlData.project?.length === 1 &&
            projects !== null
        ),
        distinctUntilChanged((a, b) => a[0].project![0] === b[0].project![0]),
        map(([urlData, projects]) => {
          const matchedProject = projects!.find(
            (project) => project.id === parseInt(urlData.project![0], 10)
          );
          if (urlData.orgSlug && matchedProject) {
            this.projectEnvironmentsService
              .retrieveEnvironmentsWithProperties(
                urlData.orgSlug,
                matchedProject.slug
              )
              .subscribe();
          }
        })
      )
      .subscribe();

    /**
     * When changing from one project to another, see if there is an environment
     * in the URL. If it doesn't match a project environment, reset the URL.
     */
    this.resetEnvironmentSubscription = combineLatest([
      this.projectEnvironmentsService.visibleEnvironmentsLoaded$,
      this.route.queryParams,
    ])
      .pipe(
        tap(([projectEnvironments, { environment }]) => {
          if (environment && !projectEnvironments.includes(environment)) {
            this.environmentForm.setValue({ environment: null });
            this.router.navigate([], {
              queryParams: { environment: null },
              queryParamsHandling: "merge",
            });
          }
        })
      )
      .subscribe();

    this.searchDirectHitSubscription = this.searchDirectHit$.subscribe(
      (directHit) => {
        this.router.navigate(
          [directHit.id, "events", directHit.matchingEventId],
          {
            relativeTo: this.route,
            queryParams: { query: null },
            queryParamsHandling: "merge",
            replaceUrl: true, // so the browser back button works
          }
        );
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe((_) => {
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
        startDate: start ? start : null,
        endDate: end ? end : null,
      });
    });
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.orgEnvironmentSubscription.unsubscribe();
    this.projectEnvironmentSubscription.unsubscribe();
    this.resetEnvironmentSubscription.unsubscribe();
    this.searchDirectHitSubscription.unsubscribe();
    this.issuesService.clearState();
    this.projectEnvironmentsService.clearState();
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

  bulkMarkResolved() {
    this.issuesService.bulkSetStatus("resolved");
  }

  bulkMarkUnresolved() {
    this.issuesService.bulkSetStatus("unresolved");
  }

  bulkMarkIgnored() {
    this.issuesService.bulkSetStatus("ignored");
  }

  toggleCheck(issueId: number) {
    this.issuesService.toggleSelected(issueId);
  }

  toggleSelectAll() {
    this.issuesService.toggleSelectAll();
  }

  bulkUpdateProject() {
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(
        map(([params, queryParams]) => {
          this.issuesService.bulkUpdateIssuesForProject(
            params["org-slug"],
            queryParams.project,
            queryParams.query
          );
        })
      )
      .subscribe();
  }

  clearBulkProjectUpdate() {
    this.issuesService.clearProjectInfo();
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

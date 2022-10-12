import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Router, ActivatedRoute } from "@angular/router";
import { combineLatest, Subject, takeUntil } from "rxjs";
import { map, withLatestFrom, tap, switchMap } from "rxjs/operators";
import { IssuesService, IssuesState } from "../issues.service";
import { normalizeProjectParams } from "src/app/shared/shared.utils";
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
  loading$ = this.service.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  searchHits$ = this.service.searchHits$;
  searchDirectHit$ = this.service.searchDirectHit$;
  form = new UntypedFormGroup({
    query: new UntypedFormControl(""),
  });
  sortForm = new UntypedFormGroup({
    sort: new UntypedFormControl({
      value: "",
      disabled: true,
    }),
  });
  environmentForm = new UntypedFormGroup({
    environment: new UntypedFormControl({ value: "" }),
  });
  dateForm = new UntypedFormGroup({
    startDate: new UntypedFormControl(""),
    endDate: new UntypedFormControl(""),
  });

  issues$ = this.service.issuesWithSelected$;
  areAllSelected$ = this.service.areAllSelected$;
  thereAreSelectedIssues$ = this.service.thereAreSelectedIssues$;
  selectedProjectInfo$ = this.service.selectedProjectInfo$;
  numberOfSelectedIssues$ = this.service.numberOfSelectedIssues$;
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
  issuesLookup$: Subject<void> = new Subject();
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
    super(service, router, route);

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

    this.issuesLookup$
      .pipe(
        withLatestFrom(this.navigationEnd$),
        switchMap(([_, params]) =>
          this.service.getIssues(
            params.orgSlug!,
            params.cursor,
            params.query,
            params.project,
            params.start,
            params.end,
            params.sort,
            params.environment
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.navigationEnd$.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.orgSlug) {
        this.issuesLookup$.next();
      }
    });

    this.organizationsService
      .observeOrgEnvironments(this.navigationEnd$)
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.projectEnvironmentsService
      .observeProjectEnvironments(this.navigationEnd$)
      .pipe(takeUntil(this.destroy$))
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
        takeUntil(this.destroy$),
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

    this.searchDirectHit$
      .pipe(takeUntil(this.destroy$))
      .subscribe((directHit) => {
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
    super.ngOnDestroy();
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
    this.service.bulkSetStatus("resolved");
  }

  bulkMarkUnresolved() {
    this.service.bulkSetStatus("unresolved");
  }

  bulkMarkIgnored() {
    this.service.bulkSetStatus("ignored");
  }

  toggleCheck(issueId: number) {
    this.service.toggleSelected(issueId);
  }

  toggleSelectAll() {
    this.service.toggleSelectAll();
  }

  bulkUpdateProject() {
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(
        map(([params, queryParams]) => {
          this.service.bulkUpdateIssuesForProject(
            params["org-slug"],
            queryParams.project,
            queryParams.query
          );
        })
      )
      .subscribe();
  }

  clearBulkProjectUpdate() {
    this.service.clearProjectInfo();
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

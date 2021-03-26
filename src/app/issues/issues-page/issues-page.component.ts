import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { formatDate } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription, combineLatest, EMPTY } from "rxjs";
import {
  map,
  filter,
  withLatestFrom,
  distinctUntilChanged,
  take,
  tap,
  skip,
  mergeMap,
} from "rxjs/operators";
import { IssuesService, IssuesState } from "../issues.service";
import { normalizeProjectParams } from "../utils";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-stateful-service";
import { ProjectEnvironmentsService } from "src/app/settings/projects/project-detail/project-environments/project-environments.service";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesPageComponent
  extends PaginationBaseComponent<IssuesState, IssuesService>
  implements OnInit, OnDestroy {
  displayedColumns: string[] = ["select", "title", "events"];
  loading$ = this.issuesService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  searchHits$ = this.issuesService.searchHits$;
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
  activeOrganizationProjects$ = this.organizationsService
    .activeOrganizationProjects$;
  activeOrganization$ = this.organizationsService.activeOrganization$;
  navigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([event, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const cursor: string | undefined = queryParams.cursor;
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
      return { orgSlug, cursor, query, project, start, end, sort };
    })
  );
  routerEventSubscription: Subscription;
  orgEnvironmentSubscription: Subscription;
  projectEnvironmentSubscription: Subscription;
  resetEnvironmentSubscription: Subscription;
  eventCountPluralMapping: { [k: string]: string } = {
    "=1": "1 event",
    other: "# events",
  };

  /**
   * Two ways to trigger project detail. The first is if we switch orgs.
   * Filtered out the cases where orgSlug from URL wasn't the same as
   * active org, and then only move on if the slug actually changes.
   */
  projectDetailTriggerSwitchOrgs = combineLatest([
    this.navigationEnd$,
    this.activeOrganization$,
  ]).pipe(
    filter(([navEnd, activeOrg]) => {
      return navEnd.orgSlug && activeOrg
        ? navEnd.orgSlug === activeOrg.slug
        : false;
    }),
    distinctUntilChanged(
      ([_, previousActiveOrg], [__, currentActiveOrg]) =>
        previousActiveOrg?.slug === currentActiveOrg?.slug
    ),
    map(([navEnd, activeOrg]) => ({
      orgSlug: navEnd.orgSlug,
      projectId: navEnd.project,
      activeOrgProjects: activeOrg ? activeOrg.projects : [],
    }))
  );

  /**
   * Two ways to trigger project detail. The second is if project URL
   * params change.
   */
  projectDetailTriggerProjectCount = combineLatest([
    this.navigationEnd$,
    this.activeOrganization$,
  ]).pipe(
    filter(([navEnd]) => (navEnd.project ? navEnd.project.length > 0 : false)),
    distinctUntilChanged(
      ([previousNavEnd], [currentNavEnd]) =>
        previousNavEnd.project?.toString() === currentNavEnd.project?.toString()
    ),
    map(([navEnd, activeOrg]) => ({
      orgSlug: navEnd.orgSlug,
      projectId: navEnd.project,
      activeOrgProjects: activeOrg ? activeOrg.projects : [],
    }))
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

  organizationEnvironments$ = combineLatest([
    this.appliedProjectCount$,
    this.issuesService.organizationEnvironmentsProcessed$,
    this.environmentsService.visibleEnvironments$,
  ]).pipe(
    map(([appliedProjectCount, orgEnvironments, projectEnvironments]) =>
      appliedProjectCount !== 1 ? orgEnvironments : projectEnvironments
    )
  );

  constructor(
    private issuesService: IssuesService,
    private router: Router,
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private environmentsService: ProjectEnvironmentsService
  ) {
    super(issuesService);

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
      ({ orgSlug, cursor, query, project, start, end, sort }) => {
        if (orgSlug) {
          this.issuesService.getIssues(
            orgSlug,
            cursor,
            query,
            project,
            start,
            end,
            sort
          );
        }
      }
    );

    this.orgEnvironmentSubscription = this.navigationEnd$
      .pipe(
        distinctUntilChanged((a, b) => a.orgSlug === b.orgSlug),
        mergeMap(({ orgSlug }) =>
          orgSlug
            ? this.issuesService.getOrganizationEnvironments(orgSlug)
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
            this.environmentsService
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
      this.environmentsService.visibleEnvironments$,
      this.route.queryParams,
    ])
      .pipe(
        distinctUntilChanged((a, b) => a[0] === b[0]),
        // distinctUntilChanged passes the first time because it doesn't have
        // two things to compare
        skip(1),
        tap(([projectEnvironments, queryParams]) => {
          const newQuery = this.removeEnvironmentQueryIfMatched(
            projectEnvironments,
            queryParams.query
          );
          if (newQuery !== false) {
            this.environmentForm.setValue({
              environment: null,
            });
            this.router.navigate([], {
              queryParams: { query: newQuery },
              queryParamsHandling: "merge",
            });
          }
        })
      )
      .subscribe();
  }

  /**
   * Takes a query, looks for the environment tag, and checks it against a list.
   * If it matches the list, build a new query string without it.
   *
   * If removing the environment results in an empty query, return null.
   *
   * If there's no query, no environment, or if there's a match, do nothing.
   */
  removeEnvironmentQueryIfMatched(
    projectEnvironments: string[],
    query: string | undefined
  ) {
    if (!!query) {
      const queryObject = this.getQueryAsObject(query);
      if (queryObject.environment) {
        const environmentMatch = projectEnvironments.find(
          (environment) => environment === queryObject.environment
        );
        if (!environmentMatch) {
          delete queryObject.environment;
          const newQuery = this.getQueryObjectAsString(queryObject);
          return !!newQuery ? newQuery : null;
        }
      }
    }
    return false;
  }

  ngOnInit() {
    this.route.params.subscribe((_) => {
      const query: string | undefined = this.route.snapshot.queryParams.query;
      const start: string | undefined = this.route.snapshot.queryParams.start;
      const end: string | undefined = this.route.snapshot.queryParams.end;
      const sort: string | undefined = this.route.snapshot.queryParams.sort;
      this.form.setValue({
        query: query !== undefined ? query : "is:unresolved",
      });
      this.sortForm.setValue({
        sort: sort !== undefined ? sort : "-last_seen",
      });
      this.environmentForm.setValue({
        environment:
          query !== undefined ? this.getEnvironmentFromQuery(query) : "",
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
    this.issuesService.clearState();
    this.environmentsService.clearState();
  }

  onDateFormSubmit() {
    /**
     * The + "Z" feels ridiculous, but it works, and avoids problems I didn't
     * have time to solve
     */
    const startDate = this.dateForm.value.startDate
      ? formatDate(
          this.dateForm.value.startDate,
          "yyyy-MM-ddTHH:mm:ss.SSS",
          "en-US"
        ) + "Z"
      : null;

    /**
     * End dates come in at midnight, so if you pick May 5, you don't get events
     * from May 5. Bumping it to 23:59:59.999 fixes this
     */
    const modifiedEndDate = this.dateForm.value.endDate
      ? this.dateForm.value.endDate.getTime() + 86399999
      : null;
    const endDate = modifiedEndDate
      ? formatDate(modifiedEndDate, "yyyy-MM-ddTHH:mm:ss.SSS", "en-US") + "Z"
      : null;
    this.router.navigate([], {
      queryParams: {
        cursor: null,
        start: startDate ? startDate : null,
        end: endDate ? endDate : null,
      },
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

  onSubmit() {
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

  sortByChanged(event: MatSelectChange) {
    this.router.navigate([], {
      queryParams: { sort: event.value },
      queryParamsHandling: "merge",
    });
  }

  getEnvironmentFromQuery(query: string) {
    const queryObject = this.getQueryAsObject(query);
    if (queryObject.environment) {
      return queryObject.environment;
    }
    return "";
  }

  getQueryAsObject(query: string) {
    // queries are split via spaces, but not spaces inside of a quote pair
    // https://stackoverflow.com/a/25663729/
    // assumption: no double quotes apart from what's wrapping a tag's key/value
    const splitQuery: string[] = query.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    const queryArrayOfArrays = splitQuery.map((queryItem) =>
      queryItem.split(":")
    );
    queryArrayOfArrays.forEach((queryArray, index) => {
      queryArray.forEach((queryString, innerIndex) => {
        if (queryString.startsWith('"') && queryString.endsWith('"')) {
          queryArrayOfArrays[index][innerIndex] = queryString
            .substr(1)
            .slice(0, -1);
        }
      });
    });
    return Object.assign(
      {},
      ...queryArrayOfArrays.map((queryItem) => {
        // Special case, for when `query=`. Otherwise it'd be
        // { "": undefined }, which would screw with the types
        if (queryItem.length === 1) {
          queryItem = ["_special", "all"];
        }
        const object: { [key: string]: string } = {};
        object[queryItem[0]] = queryItem[1];
        return object;
      })
    ) as { [key: string]: string };
  }

  getQueryObjectAsString(queryObject: { [key: string]: string }) {
    const keyNoQuoteWhiteList = ["is", "has"];
    const keyBlackList = ["_special"];
    return Object.keys(queryObject)
      .filter((key) => keyBlackList.indexOf(key) === -1)
      .map((key) => {
        if (keyNoQuoteWhiteList.indexOf(key) > -1) {
          return `${key}:${queryObject[key]}`;
        }
        return `"${key}":"${queryObject[key]}"`;
      })
      .join(" ");
  }

  getNewQueryEnvironment(
    newEnvironmentName: string | null,
    query: string | undefined
  ) {
    let newQuery: string | null = null;
    const queryObject =
      query !== undefined ? this.getQueryAsObject(query) : null;

    if (newEnvironmentName === null) {
      if (queryObject && !!queryObject.environment) {
        delete queryObject.environment;
        const objectAsString = this.getQueryObjectAsString(queryObject);
        newQuery = objectAsString === "" ? null : objectAsString;
      }
    } else {
      if (queryObject) {
        queryObject.environment = newEnvironmentName;
        newQuery = this.getQueryObjectAsString(queryObject);
      } else {
        newQuery = `is:unresolved "environment":"${newEnvironmentName}"`;
      }
    }
    return newQuery;
  }

  filterByEnvironment(event: MatSelectChange) {
    this.route.queryParams
      .pipe(
        take(1),
        map((queryParams) => {
          this.router.navigate([], {
            queryParams: {
              query: this.getNewQueryEnvironment(
                event.value,
                queryParams.query
              ),
            },
            queryParamsHandling: "merge",
          });
        })
      )
      .subscribe();
  }
}

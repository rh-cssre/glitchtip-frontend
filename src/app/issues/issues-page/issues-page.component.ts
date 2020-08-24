import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription, combineLatest } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import { IssuesService } from "../issues.service";
import { normalizeProjectParams } from "../utils";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { formatDate } from "@angular/common";
import { OrganizationProject } from "src/app/api/organizations/organizations.interface";
import { ProjectsService } from "src/app/api/projects/projects.service";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["select", "status", "title", "events"];
  loading$ = this.issuesService.loading$;
  initialLoadComplete$ = this.issuesService.initialLoadComplete$;
  form = new FormGroup({
    query: new FormControl(""),
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
  thereAreSelectedIssues$ = this.issuesService.selectedIssues$.pipe(
    map((selectedIssues) => selectedIssues.length > 0)
  );
  hasNextPage$ = this.issuesService.hasNextPage$;
  hasPreviousPage$ = this.issuesService.hasPreviousPage$;
  nextParams$ = this.issuesService.nextPageParams$;
  previousParams$ = this.issuesService.previousPageParams$;
  activeOrganizationProjects$ = this.organizationsService
    .activeOrganizationProjects$;
  routerEventSubscription: Subscription;
  orgHasAProject$ = this.activeOrganizationProjects$.pipe(
    map((projects) => !!projects && projects.length > 0)
  );
  activeProject$ = this.projectsService.activeProject$;
  activeProjectFirstEvent$ = this.activeProject$.pipe(
    map((project) => (project ? project.firstEvent : null))
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

  /**
   * Either a single project is applied with the picker, or there's only one
   * project, which is functionally similar for some things
   */
  singleProjectApplied$ = combineLatest([
    this.appliedProjectCount$,
    this.activeOrganizationProjects$,
  ]).pipe(
    map(([appliedProjectCount, activeOrganizationProjects]) => {
      if (
        appliedProjectCount === 1 ||
        activeOrganizationProjects?.length === 1
      ) {
        return true;
      }
      return false;
    })
  );

  showOnboarding$ = combineLatest([
    this.singleProjectApplied$,
    this.activeProjectFirstEvent$,
  ]).pipe(
    map(
      ([singleProjectApplied, activeProjectFirstEvent]) =>
        singleProjectApplied && activeProjectFirstEvent === null
    )
  );

  projectsWhereAdminIsNotOnTheTeam$ = combineLatest([
    this.projectsFromParams$,
    this.activeOrganizationProjects$,
  ]).pipe(
    map(([projectsFromParams, activeOrgProjects]) => {
      if (!Array.isArray(projectsFromParams)) {
        return [];
      }
      const projectsMatchedFromParams: OrganizationProject[] = [];
      projectsFromParams.forEach((projectId) => {
        const matchedProject = activeOrgProjects?.find(
          (project) => project.id === parseInt(projectId, 10)
        );
        if (matchedProject) {
          projectsMatchedFromParams.push(matchedProject);
        }
      });
      return projectsMatchedFromParams.filter(
        (project) => project.isMember === false
      );
    })
  );

  urlHasParam$ = this.route.queryParams.pipe(
    map((params) => !!params.query || !!params.start || !!params.end)
  );

  userNotInSomeTeams$ = combineLatest([
    this.projectsWhereAdminIsNotOnTheTeam$,
    this.appliedProjectCount$,
  ]).pipe(
    map(
      ([projectsWhereAdminIsNotOnTheTeam, appliedProjectCount]) =>
        projectsWhereAdminIsNotOnTheTeam.length && appliedProjectCount > 1
    )
  );

  constructor(
    private issuesService: IssuesService,
    private router: Router,
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService
  ) {
    this.routerEventSubscription = this.router.events
      .pipe(
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
          return { orgSlug, cursor, query, project, start, end };
        })
      )
      .subscribe(({ orgSlug, cursor, query, project, start, end }) => {
        if (orgSlug) {
          this.issuesService.getIssues(
            orgSlug,
            cursor,
            query,
            project,
            start,
            end
          );
          this.projectsService.retrieveProjectDetail(orgSlug, "aldan");
        }
      });
  }

  ngOnInit() {
    this.route.params.subscribe((_) => {
      const query: string | undefined = this.route.snapshot.queryParams.query;
      const start: string | undefined = this.route.snapshot.queryParams.start;
      const end: string | undefined = this.route.snapshot.queryParams.end;
      this.form.setValue({
        query: query !== undefined ? query : "is:unresolved",
      });
      this.dateForm.setValue({
        startDate: start ? start : null,
        endDate: end ? end : null,
      });
    });

    this.activeProject$.subscribe((activeProject) => {
      console.log("activeProject", activeProject);
    });
    this.activeOrganizationProjects$.subscribe((projects) => {
      console.log("active org projects", projects);
    });
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.issuesService.clearState();
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
}

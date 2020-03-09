import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, combineLatest, Observable, EMPTY } from "rxjs";
import { tap, catchError, map, distinctUntilChanged } from "rxjs/operators";
import {
  Issue,
  IssueWithSelected,
  IssueStatus,
  UpdateStatusResponse,
  IssuesUrlParams,
  IssuesUrlParamsState
} from "./interfaces";
import { baseUrl } from "../constants";
import { ActivatedRoute, Router } from "@angular/router";
import { OrganizationsService } from "../api/organizations/organizations.service";

interface IssuesState {
  issues: Issue[];
  selectedIssues: number[];
  issueCount: number | null;
  page: number | null;
  nextPage: string | null;
  previousPage: string | null;
  organizationIssueApiUrl: string | null;
}

const ISSUES_API_URL = `${baseUrl}/issues/`;

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  issueCount: null,
  page: null,
  nextPage: null,
  previousPage: null,
  organizationIssueApiUrl: null
};

@Injectable({
  providedIn: "root"
})
export class IssuesService {
  private issuesState = new BehaviorSubject<IssuesState>(initialState);
  private getState$ = this.issuesState.asObservable();
  private url = ISSUES_API_URL;

  activeOrganizationSlug$ = this.organizationService.activeOrganizationSlug$;
  organizationApiUrl: string | null;

  // debugState = this.getState$.subscribe(state => console.log(state));

  issues$ = this.getState$.pipe(map(state => state.issues));
  selectedIssues$ = this.getState$.pipe(map(state => state.selectedIssues));
  issuesWithSelected$: Observable<IssueWithSelected[]> = combineLatest([
    this.issues$,
    this.selectedIssues$
  ]).pipe(
    map(([issues, selectedIssues]) =>
      issues.map(issue => ({
        ...issue,
        isSelected: selectedIssues.includes(issue.id) ? true : false
      }))
    )
  );
  areAllSelected$ = combineLatest([this.issues$, this.selectedIssues$]).pipe(
    map(([issues, selectedIssues]) => issues.length === selectedIssues.length)
  );
  issueCount$ = this.getState$.pipe(map(state => state.issueCount));
  hasNextPage$ = this.getState$.pipe(map(state => state.nextPage !== null));
  hasPreviousPage$ = this.getState$.pipe(
    map(state => state.previousPage !== null)
  );
  nextPageParams$ = this.getState$.pipe(
    map(state => this.urlParamsToObject(state.nextPage))
  );
  previousPageParams$ = this.getState$.pipe(
    map(state => this.urlParamsToObject(state.previousPage))
  );

  /** Watch the URL for param changes */
  routeQueryParams$ = this.route.queryParams;
  /* Make params easier to work with in the code */
  normalizedGetParams$: Observable<
    IssuesUrlParamsState
  > = this.routeQueryParams$.pipe(
    map(params => ({
      project: this.getAppliedProjectsFromParams(params.project),
      query: params.query ? params.query : "is:unresolved",
      cursor: params.cursor ? params.cursor : null
    }))
  );
  /* Convert params to what the URL needs */
  preppedGetParams$: Observable<
    IssuesUrlParams
  > = this.normalizedGetParams$.pipe(
    map(getParams => {
      // Trying to futureproof this a bit
      const keys = Object.keys(getParams);
      const preppedParams: IssuesUrlParams = {};
      keys.forEach(param =>
        getParams[param] ? (preppedParams[param] = getParams[param]) : null
      );
      // Project is a special case. Need to be able to do project=1&project=2
      // Which is possible with JSON but not with JS objects
      if (getParams.project) {
        preppedParams.project = getParams.project.join(",");
      }
      // console.log("process get param", preppedParams);
      return preppedParams;
    }),
    distinctUntilChanged()
  );
  appliedProjectIds$ = this.normalizedGetParams$.pipe(
    map(getParams => getParams.project)
  );

  // Turns out you can't have multiple subscriptions to the same observable,
  // at least not the way I was doing it.
  // organizationIssueApiUrl$ = this.activeOrganizationSlug$.pipe(
  //   map(slug => {
  //     this.setOrganizationIssuesApiUrl(
  //       slug === null
  //         ? ISSUES_API_URL
  //         : `${baseUrl}/organizations/${slug}/issues/`
  //     );
  //   })
  // );

  // urlWatcher = combineLatest([
  //   this.preppedGetParams$,
  //   this.activeOrganizationSlug$
  // ]).subscribe(([getParams, slug]) => {
  //   console.log("URL changed!", getParams, slug);
  //   this.getIssues(getParams).subscribe();
  // });

  paramWatcher = this.preppedGetParams$.subscribe(getParams => {
    console.log("URL changed by params", getParams);
    this.triggerGetIssues(getParams);
  });

  orgSlugWatcher = this.activeOrganizationSlug$.subscribe(slug => {
    console.log("URL changed by slug", slug);

    // If we're switching from null to something, then hopefully (for the sake
    // of my assumptions) we're doing an initial load, and we'd want to keep
    // the URL params
    const currentUrl = this.issuesState.getValue().organizationIssueApiUrl;
    const keepParams = currentUrl === null;

    this.setOrganizationIssuesApiUrl(
      slug === null ? null : `${baseUrl}/organizations/${slug}/issues/`
    );

    // Rudimentary gate to make sure we're on the right page.
    // Probably need to do this somewhere else, maybe in another way.
    const onIssuesPage =
      this.router.url.includes("issues") &&
      this.router.url.includes("organizations");

    if (slug !== null && onIssuesPage) {
      this.router.navigate(["organizations", slug, "issues"], {
        queryParams: {},
        queryParamsHandling: keepParams ? "preserve" : ""
      });
      this.triggerGetIssues({});
    }
  });

  triggerGetIssues(params: IssuesUrlParams) {
    const url = this.issuesState.getValue().organizationIssueApiUrl;
    console.log("get issues", url);
    if (url) {
      this.getIssues(params, url).subscribe();
    }
  }

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private organizationService: OrganizationsService,
    private router: Router
  ) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof RouterEvent) {
    //     console.log("router event from issue service constructor!", event.url);
    //   }
    // });
  }

  urlParamsToObject(url: string | null) {
    return url
      ? this.paramsToObject(new URLSearchParams(url.split("?")[1]))
      : null;
  }

  paramsToObject(entries) {
    const result = {};
    for (const entry of entries) {
      // each 'entry' is a [key, value] tuple
      const [key, value] = entry;
      result[key] = value;
    }
    return result;
  }

  getNextPage() {
    const nextPage = this.issuesState.getValue().nextPage;
    if (nextPage) {
      this.retrieveIssues(nextPage).toPromise();
    }
  }

  getPreviousPage() {
    const previousPage = this.issuesState.getValue().previousPage;
    if (previousPage) {
      this.retrieveIssues(previousPage).toPromise();
    }
  }

  getIssues(params: IssuesUrlParams, url: string) {
    return this.retrieveIssues(url, params);
  }

  toggleSelected(issueId: number) {
    const state = this.issuesState.getValue();
    let selectedIssues: number[];
    if (state.selectedIssues.includes(issueId)) {
      selectedIssues = state.selectedIssues.filter(issue => issue !== issueId);
    } else {
      selectedIssues = state.selectedIssues.concat([issueId]);
    }
    this.issuesState.next({ ...state, selectedIssues });
  }

  toggleSelectAll() {
    const state = this.issuesState.getValue();
    if (state.issues.length === state.selectedIssues.length) {
      this.issuesState.next({
        ...state,
        selectedIssues: []
      });
    } else {
      this.issuesState.next({
        ...state,
        selectedIssues: state.issues.map(issue => issue.id)
      });
    }
  }

  /** Set one specified issue ID as status */
  setStatus(id: number, status: IssueStatus) {
    return this.updateStatus([id], status);
  }

  /** Set all selected issues to this status */
  bulkSetStatus(status: IssueStatus) {
    const selectedIssues = this.issuesState.getValue().selectedIssues;
    return this.updateStatus(selectedIssues, status).toPromise();
  }

  // Not private for testing purposes
  retrieveIssues(url: string, params?: IssuesUrlParams) {
    let httpParams = new HttpParams();
    // Assign our params to HttpParams object
    if (params) {
      Object.keys(params).forEach(key => {
        if (key !== "project") {
          httpParams = httpParams.append(key, params[key]);
        }
      });
      // Project is a special case, if there are more than one selected
      if (params.project) {
        if (params.project.includes(",")) {
          const split = params.project.split(",");
          split.forEach(id => {
            httpParams = httpParams.append("project", id);
          });
        } else {
          httpParams = httpParams.append("project", params.project);
        }
      }
    }
    return this.http
      .get<Issue[]>(url, { observe: "response", params: httpParams })
      .pipe(
        tap(resp => {
          const linkHeader = resp.headers.get("link");
          if (resp.body && linkHeader) {
            this.setIssues(resp.body);
            this.setPagination(linkHeader);
          }
        })
      );
  }

  clearState() {
    console.log("clear state!");
    this.issuesState.next(initialState);
  }

  private updateStatus(ids: number[], status: IssueStatus) {
    const params = {
      id: ids.map(id => id.toString())
    };
    const data = {
      status
    };
    return this.http
      .put<UpdateStatusResponse>(this.url, data, { params })
      .pipe(
        tap(resp => this.setIssueStatuses(ids, resp.status)),
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.snackbar.open("Error, unable to update issue");
          return EMPTY;
        })
      );
  }

  private setIssueStatuses(issueIds: number[], status: IssueStatus) {
    const state = this.issuesState.getValue();
    this.issuesState.next({
      ...state,
      issues: state.issues.map(issue =>
        issueIds.includes(issue.id) ? { ...issue, status } : issue
      ),
      selectedIssues: []
    });
  }

  private setOrganizationIssuesApiUrl(url: string | null) {
    this.issuesState.next({
      ...this.issuesState.getValue(),
      organizationIssueApiUrl: url
    });
  }

  private setIssues(issues: Issue[]) {
    this.issuesState.next({ ...this.issuesState.getValue(), issues });
  }

  /**
   * Pagination info exists in a header, parse it out and store it.
   * Anything with an actual link indicates it has results. This differs just
   * very slightly from sentry open source.
   */
  private setPagination(linkHeader: string) {
    const parts: { [key: string]: string } = linkHeader
      .split(",")
      .reduce((acc, link) => {
        const match = link.match(/<(.*)>; rel="(\w*)"/);
        if (match) {
          const url = match[1];
          const rel = match[2];
          acc[rel] = url;
          return acc;
        }
        return "";
      }, {});
    this.issuesState.next({
      ...this.issuesState.getValue(),
      nextPage: parts.next ? parts.next : null,
      previousPage: parts.prev ? parts.prev : null
    });
  }

  private getAppliedProjectsFromParams(project: string | string[] | null) {
    return project ? [...project] : null;
  }
}

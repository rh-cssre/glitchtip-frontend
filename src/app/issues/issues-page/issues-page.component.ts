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

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["select", "status", "title"];
  loading$ = this.issuesService.loading$;
  form = new FormGroup({
    query: new FormControl(""),
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
  routerEventSubscription: Subscription;

  oneProjectApplied$ = this.route.queryParams.pipe(
    map((params) => {
      const projects = normalizeProjectParams(params.project);
      return projects.length === 1;
    })
  );

  constructor(
    private issuesService: IssuesService,
    private router: Router,
    private route: ActivatedRoute
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
          return { orgSlug, cursor, query, project };
        })
      )
      .subscribe(({ orgSlug, cursor, query, project }) => {
        if (orgSlug) {
          this.issuesService.getIssues(orgSlug, cursor, query, project);
        }
      });
  }

  ngOnInit() {
    this.route.params.subscribe((_) => {
      const query: string | undefined = this.route.snapshot.queryParams.query;
      this.form.setValue({
        query: query !== undefined ? query : "is:unresolved",
      });
    });
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.issuesService.clearState();
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

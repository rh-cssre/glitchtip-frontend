import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import { IssuesService } from "../issues.service";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["select", "status", "title"];
  form = new FormGroup({
    query: new FormControl("")
  });
  issues$ = this.issuesService.issuesWithSelected$;
  areAllSelected$ = this.issuesService.areAllSelected$;
  hasNextPage$ = this.issuesService.hasNextPage$;
  hasPreviousPage$ = this.issuesService.hasPreviousPage$;
  nextParams$ = this.issuesService.nextPageParams$;
  previousParams$ = this.issuesService.previousPageParams$;
  loading$ = this.issuesService.loading$;
  routerEventSubscription: Subscription;

  constructor(
    private issuesService: IssuesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.routerEventSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        withLatestFrom(this.route.params, this.route.queryParams),
        map(([event, params, queryParams]) => {
          const orgSlug: string | undefined = params["org-slug"];
          const cursor: string | undefined = queryParams.cursor;
          const query: string | undefined = queryParams.query;
          return [orgSlug, cursor, query];
        })
      )
      .subscribe(([orgSlug, cursor, query]) => {
        if (orgSlug) {
          this.issuesService.getIssues(orgSlug, cursor, query);
        }
      });
  }

  ngOnInit() {
    this.route.params.subscribe(_ => {
      const query: string | undefined = this.route.snapshot.queryParams.query;
      this.form.setValue({
        query: query !== undefined ? query : "is:unresolved"
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
        cursor: null
      },
      queryParamsHandling: "merge"
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

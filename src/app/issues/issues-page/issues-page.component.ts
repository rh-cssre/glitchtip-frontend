import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { IssuesService } from "../issues.service";
import { RetrieveIssuesParams } from "../interfaces";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesPageComponent implements OnInit {
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

  constructor(
    private issuesService: IssuesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    /** Set initial state based on query params */
    this.issuesService.clearState();
    const params = this.getQueryParams();
    // Desired effect is to default to unresolved but don't show the query param until it's actually set
    if (params.query === undefined) {
      params.query = "is:unresolved";
    }
    this.form.controls.query.setValue(params.query);
    this.issuesService.getIssues(params).subscribe();
  }

  onSubmit() {
    this.router
      .navigate([], {
        queryParams: { query: this.form.value.query },
        queryParamsHandling: "merge"
      })
      .then(() => {
        const params = this.getQueryParams();
        this.issuesService.getIssues(params).subscribe();
      });
  }

  getNextPage() {
    this.issuesService.getNextPage();
  }

  getPreviousPage() {
    this.issuesService.getPreviousPage();
  }

  bulkMarkResolved() {
    this.issuesService.bulkSetStatus("resolved");
  }

  toggleCheck(issueId: number) {
    this.issuesService.toggleSelected(issueId);
  }

  toggleSelectAll() {
    this.issuesService.toggleSelectAll();
  }

  private getQueryParams(): RetrieveIssuesParams {
    const paramMap = this.route.snapshot.queryParamMap;
    const retrieveParams: RetrieveIssuesParams = {};

    const cursor = paramMap.get("cursor");
    if (cursor) {
      retrieveParams.cursor = cursor;
    }

    const query = paramMap.get("query");
    if (query) {
      retrieveParams.query = query;
    }
    return retrieveParams;
  }
}

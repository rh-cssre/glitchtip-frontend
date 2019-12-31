import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IssuesService } from "../issues.service";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesPageComponent {
  displayedColumns: string[] = ["select", "status", "title"];
  issues$ = this.issuesService.issuesWithSelected$;
  areAllSelected$ = this.issuesService.areAllSelected$;
  hasNextPage$ = this.issuesService.hasNextPage$;
  hasPreviousPage$ = this.issuesService.hasPreviousPage$;
  nextParams$ = this.issuesService.nextPageParams$;
  previousParams$ = this.issuesService.previousPageParams$;

  constructor(
    private issuesService: IssuesService,
    private route: ActivatedRoute
  ) {
    this.issuesService
      .retrieveInitialIssues(this.route.snapshot.queryParamMap)
      .subscribe();
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
}

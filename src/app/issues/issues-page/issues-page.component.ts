import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssuesService } from "../issues.service";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesPageComponent {
  displayedColumns: string[] = ["select", "title", "status"];
  issues$ = this.issuesService.issuesWithSelected$;
  areAllSelected$ = this.issuesService.areAllSelected$;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(private issuesService: IssuesService) {
    this.issuesService.retrieveInitialIssues().subscribe();
    this.issuesService.hasPreviousPage$.subscribe(
      previous => (this.hasPreviousPage = previous)
    );
    this.issuesService.hasNextPage$.subscribe(
      next => (this.hasNextPage = next)
    );
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

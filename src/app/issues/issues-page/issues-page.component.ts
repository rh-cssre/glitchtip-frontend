import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { IssuesService } from "../issues.service";

@Component({
  selector: "app-issues-page",
  templateUrl: "./issues-page.component.html",
  styleUrls: ["./issues-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesPageComponent {
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

  preppedGetParams$ = this.issuesService.preppedGetParams$;
  paramSubsription = this.preppedGetParams$.subscribe(getParams => {
    this.form.controls.query.setValue(getParams.query);
    this.issuesService.getIssues(getParams).subscribe();
  });

  constructor(private issuesService: IssuesService, private router: Router) {}

  onSubmit() {
    this.router.navigate([], {
      queryParams: {
        query: this.form.value.query,
        cursor: null
      },
      queryParamsHandling: "merge"
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

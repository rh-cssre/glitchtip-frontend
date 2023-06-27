import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { map, exhaustMap, tap } from "rxjs/operators";
import { EMPTY, Observable } from "rxjs";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { IssueDetailService } from "./issue-detail.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { DaysAgoPipe } from "../../shared/days-ago.pipe";
import { IssueDetailTagsComponent } from "./issue-detail-tags/issue-detail-tags.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "gt-issue-detail",
  templateUrl: "./issue-detail.component.html",
  styleUrls: ["./issue-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatTabsModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    IssueDetailTagsComponent,
    DaysAgoPipe,
    DetailHeaderComponent,
  ],
})
export class IssueDetailComponent implements OnInit {
  issue$ = this.issueService.issue$;
  issueTitle$: Observable<[string, string | null]> = this.issue$.pipe(
    map((issue) => {
      if (issue === null || issue.metadata === null) {
        return ["", null];
      }
      const metadata = issue.metadata;
      const culprit = issue.culprit;

      switch (issue.type) {
        case "error":
          if (metadata.type) {
            return [metadata.type!, culprit];
          }
          return [metadata.function!, culprit];
        case "csp":
          return [metadata.directive || "", metadata.uri || null];
        case "expectct" || "expectstaple" || "hpkp":
          return [metadata.message || "", metadata.origin || null];
        default:
          return [metadata.title!, null];
      }
    })
  );
  issueSubtitle$ = this.issue$.pipe(
    map((issue) => {
      if (issue === null || issue.metadata === null) {
        return "";
      }
      const metadata = issue.metadata;
      switch (issue.type) {
        case "error":
          return metadata.value;
        case "csp":
          return metadata.message;
        case "expectct" || "expectstaple" || "hpkp":
          return "";
        default:
          return issue.culprit;
      }
    })
  );
  initialLoadComplete$ = this.issueService.issueInitialLoadComplete$;
  form = new FormGroup({
    assignee: new FormControl(""),
  });
  issueIdParam$ = this.route.paramMap.pipe(
    map((params) => params.get("issue-id"))
  );
  organization$ = this.organizationsService.activeOrganization$;
  participantCountPluralMapping: { [k: string]: string } = {
    "=0": "No Participants",
    "=1": "1 Participant",
    other: "# Participants",
  };

  constructor(
    private issueService: IssueDetailService,
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.issueIdParam$
      .pipe(
        tap(() => this.issueService.clearState()),
        exhaustMap((issueId) => {
          if (issueId) {
            return this.issueService.retrieveIssue(+issueId);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  markResolved() {
    this.issueService.setStatus("resolved");
  }

  markUnresolved() {
    this.issueService.setStatus("unresolved");
  }

  markIgnored() {
    this.issueService.setStatus("ignored");
  }

  deleteIssue() {
    this.issueIdParam$
      .pipe(
        tap((id) => {
          if (
            id &&
            window.confirm(
              `Are you sure you want delete this issue? You will permanently lose this issue and all associated events.`
            )
          ) {
            this.issueService.deleteIssue(id.toString());
          }
        })
      )
      .subscribe();
  }

  generateBackLink(projectId: number) {
    return {
      ...this.route.snapshot.queryParams,
      project: projectId,
    };
  }
}

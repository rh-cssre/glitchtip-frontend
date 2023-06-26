import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { map, exhaustMap, tap } from "rxjs/operators";
import { EMPTY, Observable } from "rxjs";
import {
  ActionButton,
  DetailHeaderComponent,
} from "src/app/shared/detail/header/header.component";
import { IssueDetailService } from "./issue-detail.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { DaysAgoPipe } from "../../shared/days-ago.pipe";
import { IssueDetailTagsComponent } from "./issue-detail-tags/issue-detail-tags.component";

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
  actionButtons$ = this.issue$.pipe(
    map((issue) => {
      const buttons: ActionButton[] = [];
      if (issue?.status !== "resolved") {
        buttons.push({
          name: "Resolve",
          type: "primary",
          icon: "done",
          click: () => this.issueService.setStatus("resolved"),
        });
      }
      if (issue?.status !== "unresolved") {
        buttons.push({
          name: "Reopen",
          type: "primary",
          icon: "done",
          click: () => this.issueService.setStatus("unresolved"),
        });
      }
      if (issue?.status !== "ignored") {
        buttons.push({
          name: "Ignore",
          click: () => this.issueService.setStatus("ignored"),
        });
      }
      buttons.push({
        icon: "delete",
        type: "delete",
        click: () => this.deleteIssue(),
      });
      return buttons;
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

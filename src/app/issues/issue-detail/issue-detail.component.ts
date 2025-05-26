import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  computed,
  input,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { IssueDetailService } from "./issue-detail.service";
import { DaysAgoPipe } from "../../shared/days-ago.pipe";
import { IssueDetailTagsComponent } from "./issue-detail-tags/issue-detail-tags.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { DatePipe, TitleCasePipe } from "@angular/common";

@Component({
  selector: "gt-issue-detail",
  templateUrl: "./issue-detail.component.html",
  styleUrls: ["./issue-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    RouterModule,
    MatTabsModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    IssueDetailTagsComponent,
    TitleCasePipe,
    DatePipe,
    DaysAgoPipe,
    DetailHeaderComponent,
  ],
})
export class IssueDetailComponent implements OnInit {
  private issueService = inject(IssueDetailService);
  private organizationsService = inject(OrganizationsService);
  private route = inject(ActivatedRoute);

  issue = this.issueService.issue;
  issueTitle = computed(() => {
    const issue = this.issue();
    if (issue === null || issue.metadata === null) {
      return ["", null] as [string, string | null];
    }
    const metadata = issue.metadata;
    const culprit = issue.culprit;

    switch (issue.type) {
      case "error":
        if (metadata.type) {
          return [metadata.type!, culprit] as [string, string | null];
        }
        return [metadata.function!, culprit] as [string, string | null];
      case "csp":
        return [metadata.directive || "", metadata.uri || null] as [
          string,
          string | null,
        ];
      case "expectct":
      case "expectstaple":
      case "hpkp":
        return [metadata.message || "", metadata.origin || null] as [
          string,
          string | null,
        ];
      default:
        return [metadata.title!, null] as [string, string | null];
    }
  });
  issueSubtitle = computed(() => {
    const issue = this.issue();
    if (issue === null || issue.metadata === null) {
      return "";
    }
    const metadata = issue.metadata;
    switch (issue.type) {
      case "error":
        return metadata.value;
      case "csp":
        return metadata.message;
      case "expectct":
      case "expectstaple":
      case "hpkp":
        return "";
      default:
        return issue.culprit;
    }
  });
  initialLoadComplete = this.issueService.issueInitialLoadComplete;
  form = new FormGroup({
    assignee: new FormControl(""),
  });
  issueID = input.required<string>({ alias: "issue-id" });
  organization = this.organizationsService.activeOrganization;
  participantCountPluralMapping: { [k: string]: string } = {
    "=0": "No Participants",
    "=1": "1 Participant",
    other: "# Participants",
  };

  ngOnInit() {
    this.issueService.clearState();
    const issueID = this.issueID();
    // Consider moving to effect once ported to resource
    this.issueService.retrieveIssue(+issueID).toPromise();
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
    const id = this.issueID();
    if (
      id &&
      window.confirm(
        `Are you sure you want delete this issue? You will permanently lose this issue and all associated events.`,
      )
    ) {
      this.issueService.deleteIssue(id.toString());
    }
  }

  generateBackLink(projectId: number) {
    return {
      ...this.route.snapshot.queryParams,
      project: projectId,
    };
  }
}

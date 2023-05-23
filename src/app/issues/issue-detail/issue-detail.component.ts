import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl } from "@angular/forms";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { map, exhaustMap, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { IssueDetailService } from "./issue-detail.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { DaysAgoPipe } from "../../shared/days-ago.pipe";
import { IssueDetailTagsComponent } from "./issue-detail-tags/issue-detail-tags.component";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTabsModule } from "@angular/material/tabs";
import { IssueDetailTitleComponent } from "./issue-detail-title/issue-detail-title.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { NgIf, AsyncPipe, DatePipe } from "@angular/common";

@Component({
    selector: "gt-issue-detail",
    templateUrl: "./issue-detail.component.html",
    styleUrls: ["./issue-detail.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatCardModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        IssueDetailTitleComponent,
        MatTabsModule,
        RouterLinkActive,
        MatBadgeModule,
        RouterOutlet,
        IssueDetailTagsComponent,
        AsyncPipe,
        DatePipe,
        DaysAgoPipe,
    ],
})
export class IssueDetailComponent implements OnInit {
  issue$ = this.issueService.issue$;
  initialLoadComplete$ = this.issueService.issueInitialLoadComplete$;
  form = new UntypedFormGroup({
    assignee: new UntypedFormControl(""),
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

  deleteIssue(id?: number) {
    if (
      id &&
      window.confirm(
        `Are you sure you want delete this issue? You will permanently lose this issue and all associated events.`
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

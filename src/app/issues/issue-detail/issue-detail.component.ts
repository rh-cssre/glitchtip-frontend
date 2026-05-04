import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  computed,
  input,
  effect,
  signal,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { toSignal } from "@angular/core/rxjs-interop";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { IssueDetailService } from "./issue-detail.service";
import { DaysAgoPipe } from "../../shared/days-ago.pipe";
import { IssueDetailTagsComponent } from "./issue-detail-tags/issue-detail-tags.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { OrganizationsService } from "src/app/api/organizations.service";
import { DatePipe, TitleCasePipe } from "@angular/common";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { IssueStatusUpdateDropdownComponent } from "src/app/shared/issue-status-update-dropdown/issue-status-update-dropdown";
import { IssueStatus } from "../interfaces";

const STATUS_CONFIG = {
  resolved: { label: "Resolved", icon: "done" },
  unresolved: { label: "Unresolved", icon: "priority_high" },
  ignored: { label: "Ignored", icon: "notifications_off" },
} as const;

type IssueStatusType = keyof typeof STATUS_CONFIG;

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
    MatButtonToggleModule,
    IssueDetailTagsComponent,
    TitleCasePipe,
    DatePipe,
    DaysAgoPipe,
    DetailHeaderComponent,
    BackLinkComponent,
    TopAppBar,
    IssueStatusUpdateDropdownComponent,
  ],
})
export class IssueDetailComponent implements OnInit {
  private issueService = inject(IssueDetailService);
  private organizationsService = inject(OrganizationsService);
  private route = inject(ActivatedRoute);
  protected breakPointObserver = inject(BreakpointObserver);

  issue = this.issueService.issue;
  issueTitle = computed(() => {
    const issue = this.issue();
    if (!issue || issue.metadata === null) {
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
      case "default":
        return [metadata.message || "", metadata.origin || null] as [
          string,
          string | null,
        ];
      default:
        return [metadata.title!, null] as [string, string | null];
    }
  });
  issueSubtitle = computed<string>(() => {
    const issue = this.issue();
    if (!issue || issue.metadata === null) {
      return "";
    }
    const metadata = issue.metadata;
    switch (issue.type) {
      case "error":
        return metadata.value as string;
      case "csp":
        return metadata.message as string;
      case "default":
        return "";
      default:
        return issue.culprit as string;
    }
  });

  statusIcon = computed(() => {
    const issue = this.issue();
    if (!issue) return "error";

    const config = STATUS_CONFIG[issue.status as IssueStatusType];
    return config?.icon ?? "error";
  });

  statusOptions = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

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

  isMobile = signal(false);
  smallBreakpointSignal = toSignal(
    this.breakPointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
  );

  constructor() {
    effect(() => {
      this.issueService.issueID.set(this.issueID());
    });

    effect(() => {
      const breakpointResult = this.smallBreakpointSignal();
      if (breakpointResult?.matches) {
        this.isMobile.set(true);
      } else {
        this.isMobile.set(false);
      }
    });
  }

  ngOnInit() {
    this.issueService.clearState();
  }

  updateIssueStatus(status: IssueStatus) {
    this.issueService.setStatus(status);
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

  generateBackLink(projectId: string) {
    return {
      ...this.route.snapshot.queryParams,
      project: projectId,
    };
  }
}

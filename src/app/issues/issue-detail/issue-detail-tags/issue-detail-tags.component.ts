import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  computed,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { IssueDetailService } from "../issue-detail.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { IssueTagsAdjusted } from "../../interfaces";

@Component({
  selector: "gt-issue-detail-tags",
  templateUrl: "./issue-detail-tags.component.html",
  styleUrls: ["./issue-detail-tags.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, RouterLink],
})
export class IssueDetailTagsComponent implements OnInit {
  private issueService = inject(IssueDetailService);
  private organizationsService = inject(OrganizationsService);

  issueID = input.required<string>();
  orgSlug = this.organizationsService.activeOrganizationSlug;

  /** Most concentrated tags first; single-value tags carry no signal and sink. */
  rankedTags = computed<IssueTagsAdjusted[] | null>(() => {
    const tags = this.issueService.tags();
    if (!tags) return null;
    const score = (tag: IssueTagsAdjusted) =>
      tag.uniqueValues > 1 ? (tag.topValues[0]?.percent ?? 0) : -1;
    return tags
      .filter((tag) => tag.topValues.length)
      .sort((a, b) => score(b) - score(a));
  });

  ngOnInit() {
    this.issueService.retrieveTags(+this.issueID());
  }

  /** Same filter the event's tag pills apply. */
  tagQuery(key: string, value: string) {
    if (key === "environment") {
      return { environment: value };
    }
    return { query: `is:unresolved "${key}":"${value}"` };
  }
}

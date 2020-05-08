import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IssueMetadata } from "../../interfaces";

@Component({
  selector: "app-issue-detail-title",
  templateUrl: "./issue-detail-title.component.html",
  styleUrls: ["./issue-detail-title.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueDetailTitleComponent {
  @Input() title: string;
  @Input() culprit: string;
  @Input() metadata: IssueMetadata;
}

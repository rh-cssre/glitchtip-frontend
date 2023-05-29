import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import type { IssueMetadata } from "../../interfaces";
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";

@Component({
    selector: "gt-issue-detail-title",
    templateUrl: "./issue-detail-title.component.html",
    styleUrls: ["./issue-detail-title.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
    ],
})
export class IssueDetailTitleComponent {
  @Input() issueType?: string;
  @Input() culprit?: string | null;
  @Input() metadata?: IssueMetadata;
}

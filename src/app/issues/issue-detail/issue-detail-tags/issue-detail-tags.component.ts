import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  input,
} from "@angular/core";
import { IssueDetailService } from "../issue-detail.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { NgStyle } from "@angular/common";

@Component({
  selector: "gt-issue-detail-tags",
  templateUrl: "./issue-detail-tags.component.html",
  styleUrls: ["./issue-detail-tags.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NgStyle, MatTooltipModule],
})
export class IssueDetailTagsComponent implements OnInit {
  private issueService = inject(IssueDetailService);

  tags = this.issueService.tags;
  issueID = input.required<string>();

  ngOnInit() {
    this.issueService.retrieveTags(+this.issueID());
  }
}

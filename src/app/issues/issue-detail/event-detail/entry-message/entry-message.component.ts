import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "gt-entry-message",
  templateUrl: "./entry-message.component.html",
  styleUrls: ["./entry-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryMessageComponent {
  eventEntryMessage$ = this.issueService.eventEntryMessage$;

  constructor(private issueService: IssueDetailService) {}
}

import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "gt-entry-request",
  templateUrl: "./entry-request.component.html",
  styleUrls: ["./entry-request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryRequestComponent {
  eventEntryRequest$ = this.issueService.eventEntryRequest$;

  constructor(private issueService: IssueDetailService) {}
}

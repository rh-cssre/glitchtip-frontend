import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "gt-entry-csp",
  templateUrl: "./entry-csp.component.html",
  styleUrls: ["./entry-csp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryCSPComponent {
  eventEntryCSP$ = this.issueService.eventEntryCSP$;

  constructor(private issueService: IssueDetailService) {}
}

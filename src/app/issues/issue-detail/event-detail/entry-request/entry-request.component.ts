import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";

@Component({
  selector: "app-entry-request",
  templateUrl: "./entry-request.component.html",
  styleUrls: ["./entry-request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryRequestComponent implements OnInit {
  eventEntryRequest$ = this.issueService.eventEntryRequest$;

  constructor(private issueService: IssueDetailService) {}

  ngOnInit() {}

  getUrlPath(url: string) {
    return new URL(url).pathname;
  }

  getUrlDomainName(url: string) {
    return new URL(url).hostname;
  }
}

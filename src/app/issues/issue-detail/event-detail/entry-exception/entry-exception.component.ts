import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IssueDetailService } from "../../issue-detail.service";
import { isStacktrace } from "src/app/issues/utils";

@Component({
  selector: "gt-entry-exception",
  templateUrl: "./entry-exception.component.html",
  styleUrls: ["./entry-exception.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryExceptionComponent {
  @Input() eventTitle: string | undefined;
  @Input() eventPlatform: string | undefined;
  eventEntryException$ = this.issueService.eventEntryException$;
  isReversed$ = this.issueService.isReversed$;

  constructor(private issueService: IssueDetailService) {}

  checkStacktraceInterface = isStacktrace;

  getFlippedFrames() {
    this.issueService.getReversedFrames();
  }
}
